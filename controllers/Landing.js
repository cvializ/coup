var Base = require('./Base'),
    GameState = require('../models/GameState'),
    Player = require('../models/Player'),
    games = require('../games'),
    emitter = require('../emitter'),
    io = require('../server').io;

var LandingController = Base.extend({
  constants: require('../app/js/constants/socket'),
  events: {
    CREATE_GAME: function createGame(data, callback) {
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

    READY: function ready() {
      var socket = this.emitter;

      emitter.emit(this.constants.PUSH_GAME_COLLECTION, {
        destination: socket,
        games: games.getClientObject()
      });
    },

    JOIN_USER: function joinUser(data, callback) {
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
        emitter.emit(this.constants.PUSH_GAME, {
          destination: io.sockets.to(socket.game.id),
          game: games[socket.game.id].getClientObject()
        });

        // Inform the user of their success
        callback();

        // Let everyone know a user joined a game.
        emitter.emit(this.constants.PUSH_GAME_COLLECTION, {
          destination: io.sockets.to('landing'),
          games: games.getClientObject()
        });
      }
    },

    REMOVE_USER: logout,

    DISCONNECT: logout
  }
});

function logout() {
  var socket = this.emitter,
      game = socket.game;

  socket.join('landing');

  // Only log out the user if they're part of a game.
  if (game) {
    game.removeUser(socket.player);

    if (game.userCount <= 1) {
      socket.broadcast.to(game.id).emit(this.constants.FORCE_QUIT);
      delete games[game.id];
    }

    // tell the game's members that an opponent left
    socket.broadcast.to(game.id).emit(this.constants.USER_LEFT, {
      username: socket.player.name
    });

    socket.leave(game.id);
    delete socket.game;

    emitter.emit(this.constants.PUSH_GAME_COLLECTION, {
      destination: io.sockets.to('landing'),
      games: games.getClientObject()
    });
  }
}

module.exports = LandingController;
