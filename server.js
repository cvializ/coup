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

function userCount() {
  var count = 0
    , i;

  for (i in usernames) {
    if (usernames.hasOwnProperty(i)) {
      count++;
    }
  }

  return count;
}

// Routing
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/config'));

// usernames which are currently connected to the chat
var usernames = {}
  , currentMove = {
      player: null
    , responsesRemaining: 0
    , success: true
  };

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('ready', function () {
    var data = {};
    data.usernames = usernames;
    socket.emit('initialize', data);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    addedUser = true;
    
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username
    });
  });

  socket.on('remove user', function () {
    logout();
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    logout();
  });

  function logout() {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];

      if (userCount() === 1) {
        socket.broadcast.emit('you are alone');
      }

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username
      });
    }
  }

  socket.on('make move', function () {
    currentMove.player = socket.username;
    currentMove.responsesRemaining = userCount() - 1;
    currentMove.success = true;

    socket.broadcast.emit('move attempted');
  });

  socket.on('deny move', function (moveFailureCb) {
    currentMoveSuccess = false;
    io.sockets.emit('move failed', { user: currentMove.player });
  });

  socket.on('allow move', function (moveSuccessCb) {
    currentMove.responsesRemaining--;
    if (currentMove.responsesRemaining === 0) {
      io.sockets.emit('move succeeded', { user: currentMove.player });
    }
  });
});