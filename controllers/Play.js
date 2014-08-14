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
          clientMove,
          ability;

      moveData = moveData || {};


      if (game.currentPlayer.id !== socket.player.id) {
        callback('it is not your turn');
      } else if (!moveData.influence) {
        callback('move is missing influence');
      } else if (!moveData.name) {
        callback('move is missing name');
      } else {
            ability = Influences[moveData.influence].abilities[moveData.name];

        if (!ability) {
          callback('unknown move ' + moveData.influence + ':' + moveData.name);
        } else if (ability.cost > player.coins) {
          callback('you don\'t have enough coins for this ability');
        } else {
          move = new Move({
            ability: ability,
            target: game.players[moveData.target],
            player: player,
            influence: moveData.influence
          });

          clientMove = move.getClientObject();

          if (!ability.blockable && !ability.doubtable) {
            move.success(game, function (err) {
              if (err) {
                console.log('move success error ' + err);
              } else {
                pushPlayer(socket);
                io.sockets.to(game.id).emit('move succeeded', clientMove);
                game.nextTurn();
              }
            });
          } else {
            game.setCurrentMove(move);
            socket.broadcast.to(socket.game.id).emit('move attempted', clientMove);
          }
          // Let the user know no errors occured.
          callback(undefined, clientMove);
        }
      }
    },

    'block move': function blockMove(data) {
      var socket = this,
          game = socket.game,
          players = game.players,
          myPlayer = socket.player,
          move = game.getCurrentMove(),
          ability = move.ability,
          blockedPlayer = move.player,
          key;

      if (ability.needsTarget && myPlayer !== move.target) {
        console.log('Only the targeted player may block');
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
      }
    },

    'doubt move': function doubtMove(data) {
      var socket = this,
          game = socket.game,
          move = game.getCurrentMove(),
          player = move.player,
          detractor = socket.player,
          clientMove;

      move.detractor = detractor; // this player is doubting

      clientMove = move.getClientObject(); // after setting the detractor.

      if (move.player.hasInfluence(move.influence)) {
        // The player was truthful.
        // Take away the doubter's card
        move.success(game, function (err, data) {
          data = data || {};

          if (err) {
            console.log('move success error ' + err);
          } else {
            pushPlayer(socket);
            io.sockets.in(socket.game.id).emit('move doubter failed', clientMove);

            if (!data.noDoubleEliminate) {
              detractor.chooseEliminatedCard(function (err) {
                game.nextTurn();
              });
            } else {
              // We don't need the callback since the player won't
              // choose a card. But we still need to call nextTurn
              game.nextTurn();
            }
          }
        });
      } else {
        if (!data.noDoubleEliminate) {
          player.chooseEliminatedCard(function (err) {
            if (err) {
              console.log(err);
            } else {
              // the player was lying.
              // take away the player's card
              io.sockets.in(socket.game.id).emit('move doubter succeeded', clientMove);
              game.nextTurn();
            }
          });
        } else {
          game.nextTurn();
        }
      }
    },

    'allow move': function allowMove(data) {
      var socket = this,
          game = socket.game,
          move = game.getCurrentMove();

      move.responsesRemaining--;
      if (move.responsesRemaining === 0) {
        move.success(game, function (err) {
          if (err) {
            console.log('move success error ' + err);
          } else {
            pushPlayer(socket);
            io.sockets.in(game.id).emit('move succeeded', move.getClientObject());
            game.nextTurn();
          }
        });
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

      emitter.emit('push:game', {
        destination: socket,
        game: socket.game.getClientObject()
      });
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
