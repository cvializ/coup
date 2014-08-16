var Base = require('./Base'),
    Move = require('../models/Move'),
    Influences = require('../models/Influences'),
    emitter = require('../emitter'),
    io = require('../server').io;

var PlayController = Base.extend({
  events: {
    'vote start': function voteStart(callback) {
      var socket = this,
          game = socket.game;

      if (game.userCount === 1) {
        callback('please wait until others have joined');
      } else {
        game.votesToStart--;

        // Tell the user we got their vote.
        callback();

        // Start the game if everyone has voted.
        if (game.votesToStart === 0) {
          game.start();
        }
      }
    },

    'make move': function makeMove(moveData, callback) {
      var socket = this,
          game = socket.game,
          player = socket.player,
          move,
          ability,
          target;

      moveData = moveData || {};

      if (game.currentPlayer.id !== socket.player.id) {
        callback('It is not your turn.');
      } else if (!moveData.influence) {
        callback('Your move is missing the influence\'s name.');
      } else if (!moveData.name) {
        callback('Your move is missing the ability\'s name.');
      } else {
            ability = Influences[moveData.influence].abilities[moveData.name];
            target = game.players[moveData.target];

        if (!ability) {
          callback('Unknown move ' + moveData.influence + ':' + moveData.name);
        } else if (ability.needsTarget && (!target || target.eliminated)) {
          if (!target) {
            callback('The ability ' + ability.name + ' requires a target.');
          } else {
            callback('You cannot target an eliminated player.');
          }
        } else if (ability.cost > player.coins) {
          callback('you don\'t have enough coins for this ability');
        } else {
          move = new Move({
            ability: ability,
            target: target,
            player: player,
            influence: moveData.influence
          });

          if (!ability.blockable && !ability.doubtable) {
            move.success(game, function (err) {
              if (err) {
                callback(err);
              } else {
                pushPlayer(socket);
                io.sockets.to(game.id).emit('move succeeded', move.getClientObject());
                game.nextTurn();
              }
            });
          } else {
            game.setCurrentMove(move);
            socket.broadcast.to(socket.game.id).emit('move attempted', move.getClientObject());
          }
          // Let the user know no errors occured.
          callback(undefined, move.getClientObject());
        }
      }
    },

    'block move': function blockMove(data, callback) {
      var socket = this,
          game = socket.game,
          players = game.players,
          myPlayer = socket.player,
          move = game.getCurrentMove(),
          ability = move.ability,
          blockedPlayer = move.player,
          key;

      if (myPlayer.eliminated) {
        callback('Eliminated players may not respond to moves.');
      } else if (ability.needsTarget && myPlayer !== move.target) {
        callback('Only the targeted player may block');
      } else {
        move.detractor = myPlayer;

        // tell the target someone is attempting to block them
        blockedPlayer.socket.emit('move blocked', move.getClientObject());

        // tell everyone else that someone has beat them to blocking
        for (key in players) {
          if (players[key] !== myPlayer && players[key] !== blockedPlayer) {
            players[key].socket.emit('move responded to', move.getClientObject());
          }
        }

        callback();
      }
    },

    'doubt move': function doubtMove(data, callback) {
      var socket = this,
          game = socket.game,
          move = game.getCurrentMove(),
          player = move.player,
          detractor = socket.player,
          clientMove;

      if (detractor.eliminated) {
        callback('Eliminated players may not respond to moves.');
      } else {
        move.detractor = detractor; // this player is doubting
        clientMove = move.getClientObject(); // after setting the detractor.

        if (move.player.hasInfluence(move.influence)) {
          // The player was truthful.
          // Take away the doubter's card
          move.success(game, function (err, data) {
            data = data || {};

            if (err) {
              callback(err);
            } else {
              pushPlayer(socket);
              io.sockets.in(socket.game.id).emit('move doubter failed', clientMove);

              if (!data.noDoubleEliminate) {
                detractor.chooseEliminatedCard(function (err) {
                  callback();
                  game.nextTurn();
                });
              } else {
                // We don't need the chooseEliminatedCard callback since the
                // player won't _choose_ the eliminated card.
                // But we still need to call nextTurn
                callback();
                game.nextTurn();
              }
            }
          });
        } else {
          if (!data.noDoubleEliminate) {
            player.chooseEliminatedCard(function (err) {
              if (err) {
                callback(err);
              } else {
                callback();
                // the player was lying.
                // take away the player's card
                io.sockets.in(socket.game.id).emit('move doubter succeeded', clientMove);
                game.nextTurn();
              }
            });
          } else {
            callback();
            game.nextTurn();
          }
        }
      }
    },

    'allow move': function allowMove(data, callback) {
      var socket = this,
          game = socket.game,
          move = game.getCurrentMove();

      if (socket.player.eliminated) {
        callback('Eliminated players may not respond to moves.');
      } else {
        move.responsesRemaining--;

        if (move.responsesRemaining === 0) {
          move.success(game, function (err) {
            if (err) {
              callback(err);
            } else {
              callback();
              pushPlayer(socket);
              io.sockets.in(game.id).emit('move succeeded', move.getClientObject());
              game.nextTurn();
            }
          });
        } else {
          callback();
        }
      }
    },

    'blocker doubt': function blockerDoubt(data) {

      var socket = this,
          game = socket.game,
          move = game.getCurrentMove(),
          clientMove = move.getClientObject(),
          player = move.player,
          detractor = move.detractor;
      // game.currentMove.detractor should already be set!

      if (detractor.canBlock(move.influence, move.ability.name)) {
        // Wait for the player to choose their lost card before telling everyone what happened?
        player.chooseEliminatedCard(function (err) {
          if (err) {
            console.log(err);
          } else {
            // The doubter needs to give up a card because they were wrong.
            io.sockets.in(socket.game.id).emit('block doubter failed', clientMove);
            game.nextTurn();
          }
        });
      } else {
        move.success(game, function (err, data) {
          data = data || {};

          if (err) {
            console.log('move success error ' + err);
          } else {
            pushPlayer(socket);
            // The liar blocker needs to give up an influence.
            io.sockets.in(socket.game.id).emit('block doubter succeeded', clientMove);

            if (!data.noDoubleEliminate) {
              detractor.chooseEliminatedCard(function (err) {
                game.nextTurn();
              });
            } else {
              game.nextTurn();
            }
          }
        });
      }
    },

    'blocker success': function blockerSuccess(data) {
      var socket = this,
          game = socket.game;

      // the blocker succeeds in blocking the action.
      io.sockets.in(game.id).emit('block succeeded', game.getCurrentMove().getClientObject());
      game.nextTurn();
    },

    'pull:game': function pullGame() {
      var socket = this;

      if (socket && socket.game) {
        emitter.emit('push:game', {
          destination: socket,
          game: socket.game.getClientObject()
        });
      }
    },

    'pull:player': function pullPlayer(data, callback) {
      data = data || {};
      var socket = this,
          player = socket.player;

      if (data.id !== player.id) {
        callback('you may only access your information');
      } else {
        callback(undefined, player.getClientObject({ privileged: true }));
      }
    }
  }
});

function pushPlayer(socket) {
  emitter.emit('push:player', {
    destination: socket,
    player: socket.player.getClientObject({ privileged: true })
  });
}

module.exports = PlayController;
