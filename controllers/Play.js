'use strict';

const BaseController = require('./Base'),
      Move = require('../models/Move'),
      Influences = require('../models/Influences'),
      emitter = require('../emitter'),
      io = require('../server').io,
      SocketConstants = require('../app/js/constants/socket');

class PlayController extends BaseController {

  get constants() {
    return SocketConstants;
  }

  get events() {
    return {
      VOTE_START(_, callback) {
        const socket = this.emitter,
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

      MAKE_MOVE(moveData, callback) {
        const socket = this.emitter,
              game = socket.game,
              player = socket.player;
        let move,
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
              move.success(game, (err) => {
                if (err) {
                  callback(err);
                } else {
                  pushPlayer.bind(this)(socket);
                  io.sockets.to(game.id).emit(this.constants.MOVE_SUCCEEDED, move.getClientObject());
                  game.nextTurn();
                }
              });
            } else {
              game.setCurrentMove(move);
              socket.broadcast.to(socket.game.id).emit(this.constants.MOVE_ATTEMPTED, move.getClientObject());
            }
            // Let the user know no errors occured.
            callback(undefined, move.getClientObject());
          }
        }
      },

      BLOCK_MOVE(_, callback) {
        const socket = this.emitter,
              game = socket.game,
              players = game.players,
              myPlayer = socket.player,
              move = game.getCurrentMove(),
              ability = move.ability,
              blockedPlayer = move.player;

        if (myPlayer.eliminated) {
          callback('Eliminated players may not respond to moves.');
        } else if (ability.needsTarget && myPlayer !== move.target) {
          callback('Only the targeted player may block');
        } else {
          move.detractor = myPlayer;

          // tell the target someone is attempting to block them
          blockedPlayer.socket.emit(this.constants.MOVE_BLOCKED, move.getClientObject());

          // tell everyone else that someone has beat them to blocking
          for (let key in players) {
            if (players[key] !== myPlayer && players[key] !== blockedPlayer) {
              players[key].socket.emit(this.constants.MOVE_RESPONDED_TO, move.getClientObject());
            }
          }

          callback();
        }
      },

      DOUBT_MOVE(data, callback) {
        const socket = this.emitter,
              game = socket.game,
              move = game.getCurrentMove(),
              player = move.player,
              detractor = socket.player;
        let clientMove;

        if (detractor.eliminated) {
          callback('Eliminated players may not respond to moves.');
        } else {
          move.detractor = detractor; // this player is doubting
          clientMove = move.getClientObject(); // after setting the detractor.

          if (move.player.hasInfluence(move.influence)) {
            // The player was truthful.
            // Take away the doubter's card
            move.success(game, (err, data) => {
              data = data || {};

              if (err) {
                callback(err);
              } else {
                pushPlayer.bind(this)(socket);
                io.sockets.in(socket.game.id).emit(this.constants.MOVE_DOUBTER_FAILED, clientMove);

                if (!data.noDoubleEliminate) {
                  detractor.chooseEliminatedCard((err) => {
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
            io.sockets.in(socket.game.id).emit(this.constants.MOVE_RESPONDED_TO, clientMove);

            // The player was lying, so take away their card
            if (!data.noDoubleEliminate) {
              player.chooseEliminatedCard((err) => {
                if (err) {
                  callback(err);
                } else {
                  callback();
                  io.sockets.in(socket.game.id).emit(this.constants.MOVE_DOUBTER_SUCCEEDED, clientMove);
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

      ALLOW_MOVE(_, callback) {
        const socket = this.emitter,
              game = socket.game,
              move = game.getCurrentMove();

        if (socket.player.eliminated) {
          callback('Eliminated players may not respond to moves.');
        } else {
          move.responsesRemaining--;

          if (move.responsesRemaining === 0) {
            move.success(game, (err) => {
              if (err) {
                callback(err);
              } else {
                callback();
                pushPlayer.bind(this)(socket);
                io.sockets.in(game.id).emit(this.constants.MOVE_SUCCEEDED, move.getClientObject());
                game.nextTurn();
              }
            });
          } else {
            callback();
          }
        }
      },

      BLOCKER_DOUBT(_) {
        const socket = this.emitter,
              game = socket.game,
              move = game.getCurrentMove(),
              clientMove = move.getClientObject(),
              player = move.player,
              detractor = move.detractor;
        // game.currentMove.detractor should already be set!

        if (detractor.canBlock(move.influence, move.ability.name)) {
          // Wait for the player to choose their lost card before telling everyone what happened?
          player.chooseEliminatedCard((err) => {
            if (err) {
              console.log(err);
            } else {
              // The doubter needs to give up a card because they were wrong.
              io.sockets.in(socket.game.id).emit(this.constants.BLOCK_DOUBTER_FAILED, clientMove);
              game.nextTurn();
            }
          });
        } else {
          move.success(game, (err, data) => {
            data = data || {};

            if (err) {
              console.log('move success error ' + err);
            } else {
              pushPlayer.bind(this)(socket);
              // The liar blocker needs to give up an influence.
              io.sockets.in(socket.game.id).emit(this.constants.BLOCK_DOUBTER_SUCCEEDED, clientMove);

              if (!data.noDoubleEliminate) {
                detractor.chooseEliminatedCard((err) => {
                  game.nextTurn();
                });
              } else {
                game.nextTurn();
              }
            }
          });
        }
      },

      BLOCKER_SUCCESS(_, __) {
        const socket = this.emitter,
              game = socket.game;

        // the blocker succeeds in blocking the action.
        io.sockets.in(game.id).emit(this.constants.BLOCK_SUCCEEDED, game.getCurrentMove().getClientObject());
        game.nextTurn();
      },

      PULL_GAME(_, __) {
        const socket = this.emitter,
              player = socket.player;

        if (socket && socket.game) {
          emitter.emit(this.constants.PUSH_GAME, {
            destination: socket,
            game: socket.game.getClientObject()
          });
        }
      },

      PULL_PLAYER(data, callback) {
        data = data || {};
        const socket = this.emitter,
              player = socket.player;

        if (data.id !== player.id) {
          callback('you may only access your information');
        } else {
          callback(undefined, player.getClientObject({ privileged: true }));
        }
      }
    };
  }
}

function pushPlayer(socket) {
  emitter.emit(this.constants.PUSH_PLAYER, {
    destination: socket,
    player: socket.player.getClientObject({ privileged: true })
  });
}

module.exports = PlayController;
