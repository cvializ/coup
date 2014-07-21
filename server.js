var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    requirejs = require('requirejs'),
    config = requirejs('config/config'),
    uuid = require('node-uuid').v4,
    port = process.env.PORT || config.port || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

function Player(options) {
  options = options || {};

  this.id = options.id || uuid();
  this.socket = options.socket || null;
  this.name = options.name || 'Unnamed User';
  this.coins = options.coins || 2;
}

Player.prototype.getClientObject = function () {
  return {
    id: this.id,
    name: this.name,
    coins: this.coins
  };
};

function GameState(options) {
  options = options || {};

  if (!options.title) {
    throw 'Property "title" missing from GameState constructor\'s options arg';
  }

  this.id = options.id || uuid();
  this.title = options.title;
  this.players = {};
  this.userCount = 0;
  this.currentMove = null;
}

GameState.prototype.addUser = function (player) {
  this.players[player.id] = player;
  this.userCount++;
};

GameState.prototype.getClientObject = function () {
  var clientObject = {
    id: this.id,
    title: this.title,
    players: []
  };

  for (var key in this.players) {
    clientObject.players.push(this.players[key].getClientObject());
  }

  return clientObject;
};

GameState.prototype.removeUser = function (player) {
  delete this.players[player.id];
  this.userCount--;
};

function Move(moveData) {
  moveData = moveData || {};

  this.influence = moveData.influence || '';
  this.ability = moveData.ability || '';
  this.player = moveData.player || null;

  this.responsesRemaining = 0;
}

Move.prototype.getClientObject = function () {
  var clientObject = {
    player: this.player.getClientObject(),
    influence: this.influence,
    ability: this.ability
  };

  return clientObject;
};

// Routing
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/config'));

var games = {};

function gameExists(title) {
  for (var key in games) {
    if(games[key].title === title) {
      return true;
    }
  }
  return false;
}

io.on('connection', function (socket) {
  var addedUser = false;

  socket.join('landing');

  socket.on('create game', function (data) {
    data = data || {};

    if (!data.title) {
      socket.emit('create game failed', { message: 'missing title' });
    } else if (!data.username) {
      socket.emit('create game failed', { message: 'missing username' });
    } else if (gameExists(data.title)) {
      socket.emit('create game failed', { message: 'game exists' });
    } else {
      var newGame = new GameState({ title: data.title });
      games[newGame.id] = newGame;

      console.log('A new game was made: ' + newGame.id);

      socket.emit('create game succeeded', { username: data.username, id: newGame.id });
    }
  });

  socket.on('ready', function () {
    pushGames({ broadcast: false });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('join user', function (data) {
    // sanitize
    if (!data.username) {
      socket.emit('join user failed', { message: 'invalid username' });
    } else if (!data.id) {
      socket.emit('join user failed', { message: 'invalid game id' });
    } else {
      // we store the player's data in the socket for later
      socket.player = new Player({ name: data.username, socket: socket });

      socket.game = games[data.id];
      socket.join(data.id);
      socket.leave('landing');

      socket.broadcast.to(socket.game.id).emit('push:game', socket.game.getClientObject());

      // add the user to the game
      socket.game.addUser(socket.player);

      addedUser = true;

      // echo globally (all clients) that a person has connected
      socket.broadcast.to(socket.game.id).emit('user joined', {
        username: socket.player.name
      });

      socket.emit('join user succeeded');
      pushGames();
    }
  });

  // when the user disconnects.. perform this
  socket.on('remove user', function () {
    socket.join('landing');
    logout();
  });
  socket.on('disconnect', logout);

  function logout() {
    var game = socket.game;
    // remove the username from global usernames list
    if (addedUser) {
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
    }
    pushGames();
  }

  socket.on('make move', function (moveData) {
    moveData = moveData || {};

    var currentMove = socket.game.currentMove = new Move({
      influence: moveData.influence,
      ability: moveData.ability,
      player: socket.player
    });

    currentMove.responsesRemaining = socket.game.userCount - 1;

    socket.broadcast.to(socket.game.id).emit('move attempted', currentMove.getClientObject());
  });

  socket.on('block move', function (data) {
    var game = socket.game,
        targetPlayer = game.players[game.currentMove.player.id];

    // tell the target someone is attempting to block them
    targetPlayer.socket.emit('move blocked', data);
  });

  socket.on('doubt move', function (data) {
    // if the current player was telling the truth, the doubter loses a card
    // if the current player was lying, he loses a card
    if (Math.random() > 0.5) {
      io.sockets.in(socket.game.id).emit('move doubter failed');
    } else {
      io.sockets.in(socket.game.id).emit('move doubter succeeded');
    }
  });

  socket.on('allow move', function (data) {
    var currentMove = socket.game.currentMove;

    currentMove.responsesRemaining--;
    if (currentMove.responsesRemaining === 0) {
      io.sockets.in(socket.game.id).emit('move succeeded', { user: currentMove.player.getClientObject() });
    }
  });

  socket.on('blocker doubt', function (data) {
    if (Math.random() > 0.5) {
      io.sockets.in(socket.game.id).emit('block doubter succeeded');
    } else {
      io.sockets.in(socket.game.id).emit('block doubter failed');
    }
    // check if the blocker has the card they block with.
    // if so, the doubter loses a card
    // if not, the blocker loses a card
    //io.sockets.in(socket.game.id).emit('block over');
  });

  socket.on('blocker success', function (data) {
    // the blocker succeeds in blocking the action.
    io.sockets.in(socket.game.id).emit('block succeeded');
  });

  socket.on('pull:game', function () {
    socket.emit('push:game', games[socket.game.id].getClientObject());
  });

  socket.on('pull:games', function () {
    pushGames({ broadcast: false });
  });

  function pushGames(options) {
    options = options || {};
    options.broadcast = options.broadcast || true;

    var destination;

    if (options.broadcast) {
      destination = io.sockets.to('landing');
    } else {
      destination = socket;
    }

    var gameList = [];
    for (var key in games) {
      gameList.push(games[key].getClientObject());
    }

    destination.emit('push:games', gameList);
  }

});
