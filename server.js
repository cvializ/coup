var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server)
  , requirejs = require('requirejs')
  , config = requirejs('config/config')
  , port = process.env.PORT || config.port || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.get('/play/:gameName', function (req, res) {
  res.sendfile('./app/index.html');
});

function Client(socket) {
  this.socket = socket;
  this.data = {};
}

function Player(options) {
  options = options || {};

  this.name = options.name || 'Unnamed User';
  this.coins = options.coins || 2;
}


function GameState(title) {
  this.title = title;
  this.players = {};
  this.userCount = 0;
  this.currentMove = {
      player: null
    , responsesRemaining: 0
    , success: true
  };
}

GameState.prototype.addUser = function (username) {
  this.players[username] = new Player({ name: username });
  this.userCount++;
};

GameState.prototype.getClientObject = function () {
  var clientObject = {
    title: this.title,
    players: []
  };

  for (var key in this.players) {
    clientObject.players.push(this.players[key]);
  }

  return clientObject;
};

GameState.prototype.removeUser = function (username) {
  delete this.players[username];
  this.userCount--;
};

function Move(moveData) {
  moveData = moveData || {};

  this.influence = moveData.influence || '';
  this.ability = moveData.ability || '';
  this.player = moveData.player || null;

  this.responsesRemaining = 0;
}

Move.prototype.getClientMove = function () {
  return new ClientMove(player, influence, ability);
};

function ClientMove(moveData) {
  moveData = moveData || {};

  this.influence = moveData.influence || '';
  this.ability = moveData.ability || '';
  this.player = moveData.player || null;
}

// Routing
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/config'));

var games = {},
    clients = [];

io.on('connection', function (socket) {
  var addedUser = false;

  socket.join('landing');

  socket.on('create game', function (data) {
    if (!games[data.title]) {
      console.log('CREATED GAME!');
      games[data.title] = new GameState(data.title);

      pushGames();
    }
  });

  socket.on('ready', function () {
    pushGames({ broadcast: false });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('join user', function (data) {
    // we store the username in the socket session for this client
    socket.username = data.username;
    console.log(data);
    clients[socket.username] = new Client(socket);

    socket.game = games[data.title];
    socket.join(data.title);

    socket.broadcast.to(socket.game.title).emit('push:game', socket.game);

    // add the client's username to the global list
    socket.game.addUser(socket.username);

    addedUser = true;

    // echo globally (all clients) that a person has connected
    socket.broadcast.to(socket.game.title).emit('user joined', {
      username: socket.username
    });

    pushGames();

    // console.log('Telling user he joined a game.');
    // socket.emit('gamejoiner', { title: socket.game.title });
  });

  // when the user disconnects.. perform this
  socket.on('remove user', logout);
  socket.on('disconnect', logout);

  function logout() {
    // remove the username from global usernames list
    if (addedUser) {
      socket.game.removeUser(socket.username);
      delete clients[socket.username];

      if (socket.game.userCount <= 1) {
        socket.broadcast.to(socket.game.title).emit('you are alone');
        delete games[socket.game.title];
      }

      // echo globally that this client has left
      socket.broadcast.to(socket.game.title).emit('user left', {
        username: socket.username
      });
      socket.leave(socket.game.title);
      delete socket.game;
    }
  }

  socket.on('make move', function (moveData) {
    var currentMove = socket.game.currentMove = new Move(moveData);

    currentMove.player = socket.username;
    currentMove.responsesRemaining = socket.game.userCount - 1;

    socket.broadcast.to(socket.game.title).emit('move attempted', new ClientMove(currentMove));
  });

  socket.on('block move', function (data) {
    var target = clients[socket.game.currentMove.player];
    target.socket.emit('move blocked', data);
  });

  socket.on('doubt move', function (data) {
    // if the current player was telling the truth, the doubter loses a card
    // if the current player was lying, he loses a card
    if (Math.random() > 0.5) {
      io.sockets.in(socket.game.title).emit('move doubter failed');
    } else {
      io.sockets.in(socket.game.title).emit('move doubter succeeded');
    }
  });

  socket.on('allow move', function (data) {
    var currentMove = socket.game.currentMove;

    currentMove.responsesRemaining--;
    if (currentMove.responsesRemaining === 0) {
      io.sockets.in(socket.game.title).emit('move succeeded', { user: currentMove.player });
    }
  });

  socket.on('blocker doubt', function (data) {
    if (Math.random() > 0.5) {
      io.sockets.in(socket.game.title).emit('block doubter succeeded');
    } else {
      io.sockets.in(socket.game.title).emit('block doubter failed');
    }
    // check if the blocker has the card they block with.
    // if so, the doubter loses a card
    // if not, the blocker loses a card
    //io.sockets.in(socket.game.title).emit('block over');
  });

  socket.on('blocker success', function (data) {
    // the blocker succeeds in blocking the action.
    io.sockets.in(socket.game.title).emit('block succeeded');
  });

  socket.on('pull:game', function (data) {
    data = data || {};
    data.title = data.title || '';

    socket.emit('push:game', games[data.title].getClientObject());
  });

  socket.on('pull:games', pushGames);

  function pushGames(options) {
    options = options || {};
    options.broadcast = options.broadcast || true;

    var destination;

    if (options.broadcast) {
      console.log('to all users');
      destination = io.sockets.to('landing');
    } else {
      console.log('to 1 new user');
      destination = socket;
    }

    var gameList = [];
    for (var key in games) {
      gameList.push(games[key].getClientObject());
    }

    destination.emit('push:games', gameList);
  }

});
