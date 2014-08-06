var
    // Library objects
    express = require('express'),
    uuid = require('node-uuid').v4,
    extend = require('extend'),

    // Model objects
    GameState = require('./models/GameState'),
    Player = require('./models/Player'),
    Move = require('./models/Move'),
    Ability = require('./models/Ability'),
    Influences = require('./models/Influences'),

    // Server variables
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 8000,
    // State
    games = require('./models/GameCollection');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/app'));

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
    } else if (games.gameExists(data.title)) {
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

      // Give the user everything they need to know about themselves
      socket.emit('user joined', { player: socket.player.getClientObject({ privileged: true }) });

      // Push the game to the player AFTER they've connected.
      pushGame();


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
          ability = Influences[moveData.influence].abilities[moveData.name],
          move,
          clientMove,
          game = socket.game,
          player = socket.player;

      if (!ability) {
        callback('unknown move ' + moveData.influence + ':' + moveData.name);
      } else if (ability.cost > player.coins) {
        callback('you don\'t have enough coins for this ability');
      } else {
        move = new Move({
          ability: ability,
          target: game.players[moveData.target],
          player: player,
          influence: moveData.influence
        });

        clientMove = move.getClientObject();

        if (!ability.blockable && !ability.doubtable) {
          move.success(game, function (err) {
            if (err) {
              console.log('move success error ' + err);
            } else {
              pushPlayer();
              io.sockets.to(game.id).emit('move succeeded', clientMove);
            }
          });
        } else {
          game.setCurrentMove(move);
          socket.broadcast.to(socket.game.id).emit('move attempted', clientMove);
        }
        // Let the user know no errors occured.
        callback(undefined, clientMove);
      }
    }
  });

  socket.on('block move', function (data) {
    var game = socket.game,
        players = game.players,
        myPlayer = socket.player,
        move = game.getCurrentMove(),
        ability = move.ability,
        blockedPlayer = move.player,
        key;

    if (ability.needsTarget && myPlayer !== move.target) {
      console.log("Only the targeted player may block")
    } else {
      move.detractor = myPlayer;

      // tell the target someone is attempting to block them
      blockedPlayer.socket.emit('move blocked', move.getClientObject());

      // tell everyone else that someone has beat them to blocking
      for (key in players) {
        if (players[key] !== myPlayer && players[key] !== blockedPlayer) {
          players[key].socket.emit('move responded to', move.getClientObject());
        }
      }
    }
  });

  socket.on('doubt move', function (data) {
    var game = socket.game,
        move = game.getCurrentMove(),
        player = move.player,
        detractor = socket.player,
        clientMove;

    move.detractor = detractor; // this player is doubting

    clientMove = move.getClientObject(); // after setting the detractor.

    if (move.player.hasInfluence(move.influence)) {
      // The player was truthful.
      // Take away the doubter's card
      move.success(game, function (err) {
        if (err) {
          console.log('move success error ' + err);
        } else {
          pushPlayer();
          io.sockets.in(socket.game.id).emit('move doubter failed', clientMove);
          detractor.chooseEliminatedCard();
        }
      });
    } else {
      player.chooseEliminatedCard(function (err) {
        if (err) {
          console.log(err);
        } else {
          // the player was lying.
          // take away the player's card
          io.sockets.in(socket.game.id).emit('move doubter succeeded', clientMove);
        }
      });
    }
    pushGame();
  });

  socket.on('allow move', function (data) {
    var game = socket.game,
        move = game.getCurrentMove();

    move.responsesRemaining--;
    if (move.responsesRemaining === 0) {
      move.success(game, function (err) {
        if (err) {
          console.log('move success error ' + err);
        } else {
          pushPlayer();
          io.sockets.in(game.id).emit('move succeeded', move.getClientObject());
        }
      });
    }
  });

  socket.on('blocker doubt', function (data) {
    var game = socket.game,
        move = game.getCurrentMove(),
        clientMove = move.getClientObject(),
        player = move.player,
        detractor = move.detractor;
    // game.currentMove.detractor should already be set!

    if (detractor.canBlock(move.influence, move.ability.name)) {
      // Wait for the player to choose their lost card before telling everyone what happened?
      player.chooseEliminatedCard(function (err) {
        if (err) {
          console.log(err);
        } else {
          // The doubter needs to give up a card because they were wrong.
          io.sockets.in(socket.game.id).emit('block doubter failed', clientMove);
        }
      });
    } else {
      move.success(game, function (err) {
        if (err) {
          console.log('move success error ' + err);
        } else {
          pushPlayer();
          // The liar blocker needs to give up an influence.
          io.sockets.in(socket.game.id).emit('block doubter succeeded', clientMove);
          detractor.chooseEliminatedCard();
        }
      });
    }
  });

  socket.on('blocker success', function (data) {
    // the blocker succeeds in blocking the action.
    io.sockets.in(socket.game.id).emit('block succeeded', socket.game.getCurrentMove().getClientObject());
  });

  socket.on('pull:player', function (data, callback) {
    data = data || {};
    var player = socket.player;

    if (data.id !== player.id) {
      callback('you may only access your information');
    } else {
      callback(undefined, player.getClientObject({ privileged: true }));
    }
  });

  socket.on('pull:game', pushGame);

  function pushGame(options) {
    options = options || {};

    var destination = options.destination || socket.game.id;
    io.sockets.to(destination).emit('push:game', games[socket.game.id].getClientObject());
  }

  socket.on('pull:games', function () {
    pushGames({ broadcast: false });
  });

  socket.on('pull:player', function () {
    pushPlayer();
  });

  function pushPlayer() {
    socket.emit('push:player', { player: socket.player.getClientObject({ privileged: true }) });
  }

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
