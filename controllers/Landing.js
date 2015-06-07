var Base = require('./Base'),
    GameState = require('../models/GameState'),
    Player = require('../models/Player'),
    games = require('../games'),
    emitter = require('../emitter'),
    io = require('../server').io;

var LandingController = Base.extend({
  constructor: function (options) {
    this.initialize(options);

    options = options || {};

    this.serverEmitter = options.serverEmitter || emitter;
    this.io = options.io || io;
    this.games = options.games || games;
  },
  events: {
    'create game': function createGame(data, callback) {
      data = data || {};

      if (!data.title) {
        callback('missing title');
      } else if (!data.username) {
        callback('missing username');
      } else if (this.games.gameExists(data.title)) {
        callback('game exists');
      } else {
        var newGame = new GameState({ title: data.title });
        this.games[newGame.id] = newGame;

        callback(undefined, { username: data.username, id: newGame.id });
      }
    },

    'ready': function ready() {
      var self = this,
          socket = self.emitter;

      self.serverEmitter.emit('push:game:collection', {
        destination: socket,
        games: self.games.getClientObject()
      });
    },

    'join user': function joinUser(data, callback) {
      data = data || {};

      var self = this,
          socket = self.emitter,
          game = self.games[data.id];

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

        socket.game = self.games[data.id];
        socket.join(data.id);
        socket.leave('landing');

        // add the user to the game
        socket.game.addUser(socket.player);

        // Give the user everything they need to know about themselves
        socket.emit('user joined', { player: socket.player.getClientObject({ privileged: true }) });

        // Push the game to the player AFTER they've connected.
        self.serverEmitter.emit('push:game', {
          destination: self.io.sockets.to(socket.game.id),
          game: self.games[socket.game.id].getClientObject()
        });

        // Inform the user of their success
        callback();

        // Let everyone know a user joined a game.
        self.serverEmitter.emit('push:game:collection', {
          destination: self.io.sockets.to('landing'),
          games: self.games.getClientObject()
        });
      }
    },

    'remove user': logout,

    'disconnect': logout
  }
});

function logout() {
  var self = this,
      socket = self.emitter,
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

    self.serverEmitter.emit('push:game:collection', {
      destination: self.io.sockets.to('landing'),
      games: self.games.getClientObject()
    });
  }
}

module.exports = LandingController;
