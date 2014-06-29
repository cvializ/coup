// Setup basic express server
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

function Client(socket) {
  this.socket = socket;
  this.data = {};
}

function GameState() {
  this.usernames = {};
  this.userCount = 0;
  this.currentMove = {
      player: null
    , responsesRemaining: 0
    , success: true
  };
}

GameState.prototype.addUser = function (username) {
  this.usernames[username] = username;
  this.userCount++;
};

GameState.prototype.removeUser = function (username) {
  delete this.usernames[username];
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

var game = new GameState(),
    clients = {};

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('ready', function () {
    var data = {};
    data.usernames = game.usernames;
    socket.emit('initialize', data);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {

    clients[username] = new Client(socket);

    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    game.addUser(username);

    addedUser = true;

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('remove user', logout);
  socket.on('disconnect', logout);

  function logout() {
    // remove the username from global usernames list
    if (addedUser) {
      game.removeUser(socket.username);
      delete clients[socket.username];

      if (game.userCount === 1) {
        socket.broadcast.emit('you are alone');
      }

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username
      });
    }
  }

  socket.on('make move', function (moveData) {
    var currentMove = game.currentMove = new Move(moveData);

    currentMove.player = socket.username;
    currentMove.responsesRemaining = game.userCount - 1;

    socket.broadcast.emit('move attempted', new ClientMove(currentMove));
  });

  socket.on('block move', function (data) {
    var target = clients[game.currentMove.player];
    target.socket.emit('move blocked', data)
  });

  socket.on('doubt move', function (data) {
    // if the current player was telling the truth, the doubter loses a card
    // if the current player was lying, he loses a card
    if (Math.random() > .5) {
      io.sockets.emit('move doubter failed');
    } else {
      io.sockets.emit('move doubter succeeded');
    }
  });

  socket.on('allow move', function (data) {
    var currentMove = game.currentMove;

    currentMove.responsesRemaining--;
    if (currentMove.responsesRemaining === 0) {
      io.sockets.emit('move succeeded', { user: currentMove.player });
    }
  });

  socket.on('blocker doubt', function (data) {
    if (Math.random() > .5) {
      io.sockets.emit('block doubter succeeded');
    } else {
      io.sockets.emit('block doubter failed');
    }
    // check if the blocker has the card they block with.
    // if so, the doubter loses a card
    // if not, the blocker loses a card
    //io.sockets.emit('block over');
  });

  socket.on('blocker success', function (data) {
    // the blocker succeeds in blocking the action.
    io.sockets.emit('block succeeded')
  });
});
