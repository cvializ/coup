var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    uuid = require('node-uuid').v4,
    port = process.env.PORT || 8000;

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

var Abilities = {
  'default:Take Income': new Ability({
    name: 'Take Income',
    blockable: false,
    influence: 'default'
  }),
  'default:Foreign Aid': new Ability({
    name: 'Foreign Aid',
    blockable: true,
    influence: 'default'
  }),
  'default:Coup': new Ability({
    name: 'Coup',
    blockable: true,
    influence: 'default'
  })
};

function Card(options) {
  options = options || {};

  this.id = options.id || uuid();
  this.eliminated = options.eliminated || false;
}

function Duke(options) {
  Card.apply(this, arguments);

  this.title = 'Duke';
}

function Ability(options) {
  this.name = options.name || '';
  this.blockable = options.blockable || false;
  this.needsTarget = options.needsTarget || false;
  this.voting = options.voting || 'none';
  this.influence = options.influence || null; // card
}

Ability.prototype.getClientObject = function () {
  return {
    name: this.name,
    blockable: this.blockable,
    needsTarget: this.needsTarget,
    voting: this.voting,
    influence: this.influence
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
  this.deck = {};
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

GameState.prototype.setCurrentMove = function (currentMove) {
  this.currentMove = currentMove;
  this.currentMove.responsesRemaining = this.userCount - 1;
};

GameState.prototype.getCurrentMove = function () {
  return this.currentMove;
}

function Move(options) {
  options = options || {};

  this.ability = options.ability || null;
  this.detractor = options.detractor || null;
  this.player = options.player || null;

  this.responsesRemaining = 0;
}

Move.prototype.getClientObject = function () {
  var clientObject = {
    player: this.player.getClientObject(),
    detractor: this.detractor && this.detractor.getClientObject(),
    ability: this.ability.getClientObject()
  };

  return clientObject;
};

// Routing
app.use(express.static(__dirname + '/app'));

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
  socket.join('landing');

  socket.on('error', function (err) {
    console.log('ERROR!');
    console.log(err);
  });

  socket.on('create game', function (data, callback) {
    data = data || {};

    if (!data.title) {
      callback('missing title');
    } else if (!data.username) {
      callback('missing username');
    } else if (gameExists(data.title)) {
      callback('game exists');
    } else {
      var newGame = new GameState({ title: data.title });
      games[newGame.id] = newGame;

      callback(undefined, { username: data.username, id: newGame.id });
    }
  });

  socket.on('ready', function () {
    pushGames({ broadcast: false });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('join user', function (data, callback) {
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

      socket.broadcast.to(socket.game.id).emit('push:game', socket.game.getClientObject());

      // echo globally (all clients) that a person has connected
      socket.broadcast.to(socket.game.id).emit('user joined', {
        username: socket.player.name
      });

      // Inform the user of their success
      callback();

      // Let everyone know a user joined a game.
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

      pushGames();
    }
  }

  socket.on('make move', function (moveData, callback) {
    moveData = moveData || {};
    if (!moveData.influence) {
      callback('move is missing influence');
    } else if (!moveData.name) {
      callback('move is missing name');
    } else {
      var currentMove,
          key = moveData.influence + ':' + moveData.name,
          ability = Abilities[key],
          move,
          clientMove,
          game = socket.game;

      if (ability) {
        move = new Move({
          ability: ability,
          player: socket.player
        });

        clientMove = move.getClientObject();

        if (!ability.blockable) {
          io.sockets.to(game.id).emit('move succeeded', clientMove);
        } else {
          game.setCurrentMove(move);
          socket.broadcast.to(socket.game.id).emit('move attempted', clientMove);
        }
        // Let the user know no errors occured.
        callback(undefined, clientMove);
      } else {
        callback('unknown move ' + key);
      }
    }
  });

  socket.on('block move', function (data) {
    var game = socket.game,
        players = game.players,
        myPlayer = socket.player,
        move = game.getCurrentMove(),
        targetPlayer = move.player,
        key;

    move.detractor = myPlayer;

    // tell the target someone is attempting to block them
    targetPlayer.socket.emit('move blocked', move.getClientObject());

    // tell everyone else that someone has beat them to blocking
    for (key in players) {
      if (players[key] !== myPlayer && players[key] !== targetPlayer) {
        players[key].socket.emit('move responded to', move.getClientObject());
      }
    }
  });

  socket.on('doubt move', function (data) {
    var game = socket.game,
        move = game.getCurrentMove();

    move.detractor = socket.player; // this player is doubting

    // if the current player was telling the truth, the doubter loses a card
    // if the current player was lying, he loses a card
    if (Math.random() > 0.5) {
      io.sockets.in(socket.game.id).emit('move doubter failed', move.getClientObject());
    } else {
      io.sockets.in(socket.game.id).emit('move doubter succeeded', move.getClientObject());
    }
  });

  socket.on('allow move', function (data) {
    var game = socket.game,
        move = game.getCurrentMove();

    move.responsesRemaining--;
    if (move.responsesRemaining === 0) {
      io.sockets.in(game.id).emit('move succeeded', move.getClientObject());
    }
  });

  socket.on('blocker doubt', function (data) {
    // game.currentMove.detractor should already be set!
    if (Math.random() > 0.5) {
      io.sockets.in(socket.game.id).emit('block doubter succeeded', socket.game.getCurrentMove().getClientObject());
    } else {
      io.sockets.in(socket.game.id).emit('block doubter failed', socket.game.getCurrentMove().getClientObject());
    }
    // check if the blocker has the card they block with.
    // if so, the doubter loses a card
    // if not, the blocker loses a card
    //io.sockets.in(socket.game.id).emit('block over');
  });

  socket.on('blocker success', function (data) {
    // the blocker succeeds in blocking the action.
    io.sockets.in(socket.game.id).emit('block succeeded', socket.game.getCurrentMove().getClientObject());
  });

  socket.on('pull:game', function () {
    socket.emit('push:game', games[socket.game.id].getClientObject());
  });

  socket.on('pull:games', function () {
    pushGames({ broadcast: false });
  });

  function pushGames(options) {
    options = options || {};
    options.broadcast = (options.broadcast === undefined ? true : options.broadcast);
    var destination;

    // if broadcast is true, send it to all the sockets
    // in the landing room
    if (options.broadcast) {
      destination = io.sockets.to('landing');
    } else {
      // if broadcast is false, just send it to the requesting socket.
      destination = socket;
    }

    var gameList = [];
    for (var key in games) {
      gameList.push(games[key].getClientObject());
    }

    destination.emit('push:games', gameList);
  }

});
