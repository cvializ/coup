var Base = require('./Base'),
    GameState = require('../models/GameState'),
    Player = require('../models/Player'),
    games = require('../models/GameCollection'),
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
      pushGames({ destination: this });
    },

    'join user': function joinUser(data, callback) {
      var socket = this;

      // sanitize
      if (!data.username) {
        callback('invalid username');
      } else if (!data.id) {
        callback('invalid game id');
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
        io.sockets.to(socket.game.id).emit('push:game', games[socket.game.id].getClientObject());


        // Inform the user of their success
        callback();

        // Let everyone know a user joined a game.
        pushGames({ destination: io.sockets.to('landing') });
      }
    },

    'remove user': function removeUser() {
      socket.join('landing');
      logout.call(this);
    },

    'disconnect': logout
  }
});

function logout() {
  var socket = this,
      game = socket.game;

  // Only log out the user if they're part of a game.
  if (game) {
    game.removeUser(socket.player);

    if (game.userCount <= 1) {
      socket.broadcast.to(game.id).emit('you are alone');
      delete games[game.id];
    }

    // echo globally that this client has left
    socket.broadcast.to(game.id).emit('user left', {
      username: socket.player.name
    });
    socket.leave(game.id);
    delete socket.game;

    pushGames({ destination: io.sockets.to('landing') });
  }
}

function pushGames(options) {
  options = options || {};

  var gameList = [];
  for (var key in games) {
    gameList.push(games[key].getClientObject());
  }

  options.destination.emit('push:games', gameList);
}

module.exports = LandingController;
