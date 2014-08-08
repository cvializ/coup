var Base = require('./Base'),
    Move = require('../models/Move'),
    Influences = require('../models/Influences'),
    games = require('../models/GameCollection'),
    emitter = require('../emitter'),
    io = require('../server').io;

var PlayController = Base.extend({
  events: {
    'make move': function makeMove(moveData, callback) {
      var socket = this;

      moveData = moveData || {};
      if (!moveData.influence) {
        callback('move is missing influence');
      } else if (!moveData.name) {
        callback('move is missing name');
      } else {
        var currentMove,
            ability = Influences[moveData.influence].abilities[moveData.name],
            move,
            clientMove,
            game = socket.game,
            player = socket.player;

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
        console.log("Only the targeted player may block")
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
        move.success(game, function (err) {
          if (err) {
            console.log('move success error ' + err);
          } else {
            pushPlayer(socket);
            io.sockets.in(socket.game.id).emit('move doubter failed', clientMove);
            detractor.chooseEliminatedCard();
          }
        });
      } else {
        player.chooseEliminatedCard(function (err) {
          if (err) {
            console.log(err);
          } else {
            // the player was lying.
            // take away the player's card
            io.sockets.in(socket.game.id).emit('move doubter succeeded', clientMove);
          }
        });
      }
      emitter.emit('push:game', {
        destination: socket,
        game: games[socket.game.id].getClientObject()
      });
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
          }
        });
      } else {
        move.success(game, function (err) {
          if (err) {
            console.log('move success error ' + err);
          } else {
            pushPlayer(socket);
            // The liar blocker needs to give up an influence.
            io.sockets.in(socket.game.id).emit('block doubter succeeded', clientMove);
            detractor.chooseEliminatedCard();
          }
        });
      }
    },

    'blocker success': function blockerSuccess(data) {
      var socket = this;
      // the blocker succeeds in blocking the action.
      io.sockets.in(socket.game.id).emit('block succeeded', socket.game.getCurrentMove().getClientObject());
    },

    'pull:game': function pullGame() {
      var socket = this;
      emitter.emit('push:game', {
        destination: socket,
        game: games[socket.game.id].getClientObject()
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
