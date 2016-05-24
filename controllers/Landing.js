'use strict';

const BaseController = require('./Base'),
      GameState = require('../models/GameState'),
      Player = require('../models/Player'),
      games = require('../games'),
      emitter = require('../emitter'),
      ServerConstants = require('../app/js/constants/server'),
      SocketConstants = require('../app/js/constants/socket'),
      io = require('../server').io;

class LandingController extends BaseController {

  get constants() {
    return SocketConstants;
  }

  get events() {
    return {
      CREATE_GAME(data, callback) {
        data = data || {};

        if (!data.title) {
          callback('missing title');
        } else if (!data.username) {
          callback('missing username');
        } else if (games.gameExists(data.title)) {
          callback('game exists');
        } else {
          var newGame = new GameState({ title: data.title });
          games[newGame.id] = newGame;

          callback(undefined, { username: data.username, id: newGame.id });
        }
      },

      READY() {
        var socket = this.emitter;

        socket.join('landing');

        emitter.emit(this.constants.PUSH_GAME_COLLECTION, {
          destination: socket,
          games: games.getClientObject()
        });
      },

      JOIN_USER(data, callback) {
        data = data || {};

        var socket = this.emitter,
            game = games[data.id];

        // sanitize
        if (!data.username) {
          callback('invalid username');
        } else if (typeof game === 'undefined') {
          callback('invalid game id');
        } else if (game.started) {
          callback('that game is already in progress');
        } else {
          // we store the player's data in the socket for later
          socket.player = new Player({ name: data.username, socket: socket });

          socket.game = games[data.id];
          socket.join(data.id);
          socket.leave('landing');

          // add the user to the game
          socket.game.addUser(socket.player);

          // Give the user everything they need to know about themselves
          socket.emit(this.constants.USER_JOINED, { player: socket.player.getClientObject({ privileged: true }) });

          // Push the game to the player AFTER they've connected.
          emitter.emit(ServerConstants.PUSH_GAME, {
            destination: io.sockets.to(socket.game.id),
            game: games[socket.game.id].getClientObject()
          });

          // Inform the user of their success
          callback();

          // Let everyone know a user joined a game.
          emitter.emit(ServerConstants.PUSH_GAME_COLLECTION, {
            destination: io.sockets.to('landing'),
            games: games.getClientObject()
          });
        }
      },

      REMOVE_USER() {
        const socket = this.emitter,
              game = socket.game,
              player = socket.player;

        socket.join('landing');

        // Only log out the user if they're part of a game.
        if (game) {
          game.removeUser(player);

          if (game.userCount <= 1) {
            socket.broadcast.to(game.id).emit(this.constants.FORCE_QUIT);
            delete games[game.id];
          }

          // tell the game's members that an opponent left
          socket.broadcast.to(game.id).emit(this.constants.USER_LEFT, {
            username: player.name,
            id: player.id
          });

          socket.leave(game.id);
          delete socket.game;

          emitter.emit(ServerConstants.PUSH_GAME_COLLECTION, {
            destination: io.sockets.to('landing'),
            games: games.getClientObject()
          });
        }
      },

      disconnect() {
        return this.events.REMOVE_USER.apply(this, arguments);
      }
    };
  }
}

module.exports = LandingController;
