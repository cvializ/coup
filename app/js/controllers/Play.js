define([
  'marionette',
  'MainRegion',
  'Vent',
  'views/Play',
  'models/Play',
  'models/Player',
  'views/Result',
  'models/Result',
  'models/CardCollection',
  'models/PlayerCollection',
  'views/PlayerCollection',
  'views/action/Ready',
  'views/action/Primary',
  'views/action/Secondary',
  'views/action/Tertiary',
  'views/action/Pending',
  'views/action/Standby',
  'views/widgets/ChoosePlayer',
  'views/widgets/ChooseCard',
  'constants/socket',
  'constants/client'
], function (Marionette,
             mainRegion,
             vent,
             PlayView,
             PlayModel,
             PlayerModel,
             ResultView,
             ResultModel,
             CardCollectionModel,
             PlayerCollectionModel,
             PlayerCollectionView,
             ReadyActionView,
             PrimaryActionView,
             SecondaryActionView,
             TertiaryActionView,
             PendingActionView,
             StandbyActionView,
             ChoosePlayerView,
             ChooseCardView,
             socketConstants,
             clientConstants) {

  var PlayController = Marionette.Controller.extend({
    socket: null,

    game: null,

    playView: null,

    playersCollection: null,

    playersView: null,

    resultView: null,

    resultModel: null,

    handleError: function (err) {
      alert(err);
    },

    initialize: function initialize(options) {
      var self = this;

      options = options || {};
      options.socket = options.socket || null;

      self.socket = options.socket;

      vent.on(clientConstants.PLAY_INIT, function loadController() {

        self.playView = new PlayView({ model: new PlayModel({ player: self.socket.player }) });
        self.playersCollection = new PlayerCollectionModel();
        self.playersView = new PlayerCollectionView({ collection: self.playersCollection });
        self.resultModel = new ResultModel();

        mainRegion.show(self.playView);

        self.playView.player.show(self.playersView);
        self.playView.action.show(new ReadyActionView());

        updateGameData();
      });

      vent.on(clientConstants.PLAY_START_READY, function ready() {
        self.socket.emit(socketConstants.VOTE_START, function (err) {
          if (err) {
            self.handleError(err);
          } else {
            self.playView.action.show(new PendingActionView());
          }
        });
      });

      function makePrimaryMove(moveData) {
        self.playView.result.empty();
        self.socket.emit(socketConstants.MAKE_MOVE, moveData, function moveMade(err, move) {
          if (err) {
            self.handleError(err);
            self.playView.action.show(new PrimaryActionView());
          } else {
            if (move.ability.blockable || move.ability.doubtable) {
              self.playView.action.show(new PendingActionView());
            }
          }
        });
      }

      function filterPlayerChoice(player) {
        return player.id !== self.socket.player.id && !player.get('eliminated');
      }

      vent.on(clientConstants.PLAY_MOVE_PRIMARY, function primaryMove(moveData) {
        var chooseCollection,
            chooseView;
        if (moveData.needsTarget) {
          // Show the choose view
          chooseCollection = new PlayerCollectionModel(self.playersCollection.filter(filterPlayerChoice));
          chooseView = new ChoosePlayerView({ collection: chooseCollection });
          self.playView.action.show(chooseView);

          // Wait for the user to select their choice
          vent.on(clientConstants.PLAY_MOVE_PRIMARY_CHOICE, function playerChosen(data) {
            moveData.target = data.choice;
            makePrimaryMove(moveData);
            vent.off(clientConstants.PLAY_MOVE_PRIMARY_CHOICE); // this doesn't seem right
          });
        } else {
          makePrimaryMove(moveData);
        }
      });

      vent.on(clientConstants.PLAY_MOVE_SECONDARY, function secondaryMove(moveData) {
        moveData = moveData || {};
        if (moveData.type === 'allow') {
          self.socket.emit(socketConstants.ALLOW_MOVE, moveData, function (err) {
            if (err) {
              self.handleError(err);
            } else {
              self.playView.action.show(new PendingActionView({ text: 'Waiting for other players to judge...' }));
            }
          });
        } else if (moveData.type === 'block') {
          self.socket.emit(socketConstants.BLOCK_MOVE, moveData, function (err) {
            if (err) {
              self.handleError(err);
            } else {
              self.playView.action.show(new PendingActionView());
            }
          });
        } else if (moveData.type === 'doubt') {
          self.socket.emit(socketConstants.DOUBT_MOVE, moveData, function (err) {
            if (err) {
              self.handleError(err);
            }
          });
        } else {
          throw 'Unrecognized secondary move type.';
        }
      });

      vent.on(clientConstants.PLAY_MOVE_TERTIARY, function tertiaryMove(moveData) {
        moveData = moveData || {};
        if (moveData.type === 'concede') {
          self.socket.emit(socketConstants.BLOCKER_SUCCESS);
        } else if (moveData.type === 'doubt') {
          self.socket.emit(socketConstants.BLOCKER_DOUBT);
        } else {
          throw 'Unrecognized tertiary move type.';
        }
      });

      function updateGameData() {
        self.socket.emit(socketConstants.PULL_GAME);
      }

      self.socket.on(socketConstants.PUSH_GAME, function gameDataPushed(data) {
        self.game = data;

        if (self.playersCollection) {
          self.playersCollection.reset(self.game.players);
        }

        self.socket.emit(socketConstants.PULL_PLAYER, { id: self.socket.player.id }, function (err, playerData) {
          // update the player in their own socket
          self.socket.player = playerData;

          // Update the player in the collection
          var existing = self.playersCollection.filter(function (player) {
            return player.get('id') === playerData.id;
          });
          existing = existing[0];

          self.playersCollection.remove(existing);
          self.playersCollection.add(playerData);
        });
      });

      self.socket.on(socketConstants.PUSH_PLAYER, function playerPushed(data) {
        self.socket.player = data.player;
      });

      self.socket.on(socketConstants.USER_LEFT, function userLeft() {
        if (self.game.players.length > 2) {
          updateGameData();
        }
      });

      self.socket.on(socketConstants.FORCE_QUIT, function gameAbandoned() {
        self.socket.emit('remove user');
        vent.trigger(clientConstants.PLAY_END);
      });

      self.socket.on(socketConstants.MY_TURN, function myTurn() {
        self.playView.action.show(new PrimaryActionView());
      });

      self.socket.on(socketConstants.NEW_TURN, function newTurn(turnData) {
        turnData = turnData || {};
        var socket = this,
            player = turnData.player,
            text = 'It\'s ' + (player && player.name) + '\'s turn!';

        self.playView.action.show(new StandbyActionView({ text: text }));
      });

      self.socket.on(socketConstants.MOVE_ATTEMPTED, function moveAttempted(moveData) {
        var ability,
            text,
            canBlock = true;

        if (!moveData) {
          self.handleError('move is undefined!');
        } else {
          ability = moveData.ability;

          if (ability.blockable || ability.doubtable) {
            text = moveData.player.name + ' has attempted to ' + ability.name;

            if (moveData.target) {
              text += ' ' + moveData.target.name;
            }

            // If there is a target and you are not the target, do not enable the block button
            if (ability.needsTarget && moveData.target && moveData.target.id !== self.socket.player.id) {
              canBlock = false;
            }

            if (!self.socket.player.eliminated) {
              self.playView.action.show(new SecondaryActionView({ text: text, ability: ability, conditions: { blockable: canBlock } }));
            }
          }
        }
      });

      self.socket.on(socketConstants.MOVE_RESPONDED_TO, function beatToThePunch(moveData) {
        if (!moveData) {
          self.handleError('move is undefined!');
        } else {
          var text = moveData.detractor.name + ' is trying to block ' +
                     moveData.player.name + '\'s ability to ' +
                     moveData.ability.name;

          self.playView.action.show(new StandbyActionView({ text: text }));
        }
      });

      self.socket.on(socketConstants.MOVE_BLOCKED, function myMoveBlocked(moveData) {
        var message = moveData.detractor.name + ' is attempting to block you from being able to ' +
                      moveData.ability.name;
        self.showResult({ title: 'Block Attempted', message: message });
        self.playView.action.show(new TertiaryActionView());
      });

      self.socket.on(socketConstants.BLOCK_SUCCEEDED, function blockSucceeded(moveData) {
        var message = moveData.detractor.name + ' successfully blocked '+
                      moveData.player.name + '\'s ability to ' +
                      moveData.ability.name;

        self.showResult({ title: 'Blocked', message: message });
      });

      self.socket.on(socketConstants.MOVE_SUCCEEDED, function moveSucceeded(moveData) {
        var options = {
          title: moveData.ability.name + ' Succeeded!',
          message: moveData.player.name + ' was able to ' + moveData.ability.name
        };

        if (moveData.target) {
          options.message += ' ' + moveData.target.name;
        }

        self.showResult(options);
      });

      self.socket.on(socketConstants.MOVE_DOUBTER_SUCCEEDED, function moveDoubterSucceeded(moveData) {
        var doubted = moveData.player.name,
            doubter = moveData.detractor.name,
            message = doubted + ' was doubted by ' +
                      doubter + ' while trying to ' +
                      moveData.ability.name + ' and ' +
                      doubted + ' was lying!';

        self.showResult({ title: 'Move Doubted!', message: message });
      });

      self.socket.on(socketConstants.MOVE_DOUBTER_FAILED, function moveDoubterFailed(moveData) {
        var doubted = moveData.player.name,
            doubter = moveData.detractor.name,
            message = doubted + ' was doubted by ' +
                      doubter + ' while trying to ' +
                      moveData.ability.name + ' and ' +
                      doubted + ' was telling the truth!';

        self.showResult({ title: 'Move Doubted!', message: message });
      });

      self.socket.on(socketConstants.BLOCK_DOUBTER_SUCCEEDED, function blockDoubterSucceeded(moveData) {
        var blocker = moveData.detractor.name,
            blocked = moveData.player.name,
            ability = moveData.ability.name,
            message = blocked + ' doubted ' +
                      blocker + '\'s ability to block their ability to ' +
                      ability + ' and ' +
                      blocker + ' was lying! ' +
                      blocked + ' can ' + ability;

        self.showResult({ title: 'Block Doubted!', message: message });
      });

      self.socket.on(socketConstants.BLOCK_DOUBTER_FAILED, function blockDoubterFailed(moveData) {
        var blocker = moveData.detractor.name,
            blocked = moveData.player.name,
            message = blocked + ' doubted ' +
                      blocker + '\'s ability to block their ability to ' +
                      moveData.ability.name + ' but ' +
                      blocker + ' was telling the truth! ' +
                      blocked + ' blocked!';

        self.showResult({ title: 'Block Doubted!', message: message });
      });

      self.socket.on(socketConstants.SELECT_OWN_INFLUENCE, function selectInfluence(moveData, callback) {
        self.playView.action.show(new ChooseCardView({ collection: new CardCollectionModel(self.socket.player.influences) }));// Wait for the user to select their choice
        vent.on(clientConstants.PLAY_MOVE_SELECT_INFLUENCE, function influenceChosen(data) {
          // Let the server know which influence the user chose
          callback(undefined, data);
          // Remove the listener.
          vent.off(clientConstants.PLAY_MOVE_SELECT_INFLUENCE);
        });
      });

      self.socket.on(socketConstants.GAME_OVER, function gameOver(data) {
        data = data || {};
        var winner = data.winner;

        alert(winner.name + ' has WON THE GAME!');
        self.socket.emit(socketConstants.REMOVE_USER);
        vent.trigger(clientConstants.PLAY_END);
      });
    },

    showResult: function showResult(options) {
      this.resultModel.set(options);
      this.playView.result.show(new ResultView({ model: this.resultModel }));
    }
  });

  return PlayController;
});
