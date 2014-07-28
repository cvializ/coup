define([
  'marionette',
  'MainRegion',
  'Vent',
  'views/Play',
  'models/Player',
  'views/Result',
  'models/Result',
  'models/PlayerCollection',
  'views/PlayerCollection',
  'views/action/Primary',
  'views/action/Secondary',
  'views/action/Tertiary',
  'views/action/Pending',
  'views/action/Standby',
  'views/ChoosePlayer'
], function (Marionette,
             mainRegion,
             vent,
             PlayView,
             PlayerModel,
             ResultView,
             ResultModel,
             PlayerCollectionModel,
             PlayerCollectionView,
             PrimaryActionView,
             SecondaryActionView,
             TertiaryActionView,
             PendingActionView,
             StandbyActionView,
             ChoosePlayerView) {

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

      vent.on('play:init', function loadController() {

        self.playView = new PlayView();
        self.playersCollection = new PlayerCollectionModel();
        self.playersView = new PlayerCollectionView({ collection: self.playersCollection });
        self.resultModel = new ResultModel();

        mainRegion.show(self.playView);

        self.playView.player.show(self.playersView);
        self.playView.action.show(new PrimaryActionView());

        self.socket.emit('pull:game');
      });

      function makePrimaryMove(moveData) {
        self.playView.result.empty();
        self.socket.emit('make move', moveData, function moveMade(err, move) {
          if (err) {
            self.handleError(err);
          } else {
            if (move.ability.blockable || move.ability.doubtable) {
              self.playView.action.show(new PendingActionView());
            }
          }
        });
      }

      function filterPlayerChoice(player) {
        return player.id !== self.game.user.id;
      }

      vent.on('play:move:primary', function primaryMove(moveData) {
        var chooseCollection,
            chooseView;
        if (moveData.needsTarget) {
          // Show the choose view
          chooseCollection = new PlayerCollectionModel(self.playersCollection.filter(filterPlayerChoice));
          chooseView = new ChoosePlayerView({ collection: chooseCollection });
          self.playView.action.show(chooseView);

          // Wait for the user to select their choice
          vent.on('play:move:primary:choice', function playerChosen(data) {
            moveData.target = data.choice;
            makePrimaryMove(moveData);
            console.log(moveData.target);
            vent.off('play:move:primary:choice'); // this doesn't seem right
          });
        } else {
          makePrimaryMove(moveData);
        }
      });

      vent.on('play:move:secondary', function secondaryMove(moveData) {
        moveData = moveData || {};
        if (moveData.type === 'allow') {
          self.socket.emit('allow move', moveData);
          self.playView.action.show(new PendingActionView({ text: 'Waiting for other players to judge...' }));
        } else if (moveData.type === 'block') {
          self.socket.emit('block move', moveData);
          self.playView.action.show(new PendingActionView());
        } else if (moveData.type === 'doubt') {
          self.socket.emit('doubt move', moveData);
        } else {
          throw 'Unrecognized secondary move type.';
        }
      });

      vent.on('play:move:tertiary', function tertiaryMove(moveData) {
        moveData = moveData || {};
        if (moveData.type === 'concede') {
          self.socket.emit('blocker success');
        } else if (moveData.type === 'doubt') {
          self.socket.emit('blocker doubt');
        } else {
          throw 'Unrecognized tertiary move type.';
        }
      });

      self.socket.on('push:game', function updateGameData(data) {
        self.game = data;

        if (self.playersCollection) self.playersCollection.reset(self.game.players);
      });

      self.socket.on('user joined', function userJoined() {
        self.socket.emit('pull:game');
      });

      self.socket.on('user left', function userLeft() {
        if (self.game.players.length > 2) {
          self.socket.emit('pull:game');
        }
      });

      self.socket.on('you are alone', function gameAbandoned() {
        vent.trigger('play:end');
      });

      self.socket.on('move attempted', function moveAttempted(moveData) {
        var ability;

        if (!moveData) {
          self.handleError('move is undefined!');
        } else {
          ability = moveData.ability;

          if (ability.blockable || ability.doubtable) {
            var text = moveData.player.name + ' has attempted to ' + ability.name;

            if (moveData.target) {
              text += ' ' + moveData.target.name;
            }

            self.playView.action.show(new SecondaryActionView({ text: text, ability: ability }));
          }
        }
      });

      self.socket.on('move responded to', function beatToThePunch(moveData) {
        if (!moveData) {
          self.handleError('move is undefined!');
        } else {
          var text = moveData.detractor.name + ' is trying to block ' +
                     moveData.player.name + '\'s ability to ' +
                     moveData.ability.name;

          self.playView.action.show(new StandbyActionView({ text: text }));
        }
      });

      self.socket.on('move blocked', function myMoveBlocked(moveData) {
        var message = moveData.detractor.name + ' is attempting to block you from being able to ' +
                      moveData.ability.name;
        self.showResult({ title: 'Block Attempted', message: message });
        self.playView.action.show(new TertiaryActionView());
      });

      self.socket.on('block succeeded', function blockSucceeded(moveData) {
        var message = moveData.detractor.name + ' successfully blocked '+
                      moveData.player.name + '\'s ability to ' +
                      moveData.ability.name;

        self.showResult({ title: 'Blocked', message: message });
        self.playView.action.show(new PrimaryActionView());
      });

      self.socket.on('move succeeded', function moveSucceeded(moveData) {
        var options = {
          title: moveData.ability.name + ' Succeeded!',
          message: moveData.player.name + ' was able to ' + moveData.ability.name
        }

        if (moveData.target) {
          options.message += ' ' + moveData.target.name;
        }

        self.showResult(options);
        self.playView.action.show(new PrimaryActionView());
        self.socket.emit('pull:game');
      });

      self.socket.on('move doubter succeeded', function moveDoubterSucceeded(moveData) {
        var doubted = moveData.player.name,
            doubter = moveData.detractor.name,
            message = doubted + ' was doubted by ' +
                      doubter + ' while trying to ' +
                      moveData.ability.name + ' and ' +
                      doubted + ' was lying!';

        self.showResult({ title: 'Move Doubted!', message: message });
        self.playView.action.show(new PrimaryActionView());
      });

      self.socket.on('move doubter failed', function moveDoubterFailed(moveData) {
        var doubted = moveData.player.name,
            doubter = moveData.detractor.name,
            message = doubted + ' was doubted by ' +
                      doubter + ' while trying to ' +
                      moveData.ability.name + ' and ' +
                      doubted + ' was telling the truth!';

        self.showResult({ title: 'Move Doubted!', message: message });
        self.playView.action.show(new PrimaryActionView());
        self.socket.emit('pull:game');
      });

      self.socket.on('block doubter succeeded', function blockDoubterSucceeded(moveData) {
        var blocker = moveData.detractor.name,
            blocked = moveData.player.name,
            ability = moveData.ability.name,
            message = blocked + ' doubted ' +
                      blocker + '\'s ability to block their ability to ' +
                      ability + ' and ' +
                      blocker + ' was lying! ' +
                      blocked + ' can ' + ability;

        self.showResult({ title: 'Block Doubted!', message: message });
        self.playView.action.show(new PrimaryActionView());
        self.socket.emit('pull:game');
      });

      self.socket.on('block doubter failed', function blockDoubterFailed(moveData) {
        var blocker = moveData.detractor.name,
            blocked = moveData.player.name,
            message = blocked + ' doubted ' +
                      blocker + '\'s ability to block their ability to ' +
                      moveData.ability.name + ' but ' +
                      blocker + ' was telling the truth! ' +
                      blocked + ' blocked!';

        self.showResult({ title: 'Block Doubted!', message: message });
        self.playView.action.show(new PrimaryActionView());
      });
    },

    showResult: function showResult(options) {
      this.resultModel.set(options);
      this.playView.result.show(new ResultView({ model: this.resultModel }));
    }
  });

  return PlayController;
});
