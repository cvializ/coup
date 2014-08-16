var Base = require('./Base'),
    GameState = require('../models/GameState'),
    Player = require('../models/Player'),
    games = require('../models/GameCollection'),
    emitter = require('../emitter'),
    io = require('../server').io;

var LandingController = Base.extend({
  events: {
    'create game': function createGame(data, callback) {
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

    'ready': function ready() {
      var socket = this;

      emitter.emit('push:game:collection', {
        destination: socket,
        games: games.getClientObject()
      });
    },

    'join user': function joinUser(data, callback) {
      data = data || {};

      var socket = this,
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
        socket.emit('user joined', { player: socket.player.getClientObject({ privileged: true }) });

        // Push the game to the player AFTER they've connected.
        emitter.emit('push:game', {
          destination: io.sockets.to(socket.game.id),
          game: games[socket.game.id].getClientObject()
        });

        // Inform the user of their success
        callback();

        // Let everyone know a user joined a game.
        emitter.emit('push:game:collection', {
          destination: io.sockets.to('landing'),
          games: games.getClientObject()
        });
      }
    },

    'remove user': logout,

    'disconnect': logout
  }
});

function logout() {
  var socket = this,
      game = socket.game;

  socket.join('landing');

  // Only log out the user if they're part of a game.
  if (game) {
    game.removeUser(socket.player);

    if (game.userCount <= 1) {
      socket.broadcast.to(game.id).emit('force quit');
      delete games[game.id];
    }

    // tell the game's members that an opponent left
    socket.broadcast.to(game.id).emit('user left', {
      username: socket.player.name
    });

    socket.leave(game.id);
    delete socket.game;

    emitter.emit('push:game:collection', {
      destination: io.sockets.to('landing'),
      games: games.getClientObject()
    });
  }
}

module.exports = LandingController;
