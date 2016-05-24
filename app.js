var
    // Server variables
    server = require('./server'),
    io = server.io,
    emitter = require('./emitter'),

    // Controllers
    LandingController = require('./controllers/Landing'),
    PlayController = require('./controllers/Play'),
    GameDataController = require('./controllers/GameData'),
    PlayerController = require('./controllers/Player'),
    GameStateController = require('./controllers/GameState'),

    // instantiate these controller only once, since they listen for
    // server-side events only and all their dependencies are injected,
    // thus they only need to be created once.
    gdc = new GameDataController({ emitter: emitter }),
    playerController = new PlayerController({ emitter: emitter }),
    gameStateController = new GameStateController({ emitter: emitter });

server.initialize(function () {
  io.on('connection', function (socket) {
    socket.join('landing');

    socket._gameDataController = gdc;
    socket._playerController = playerController;
    socket._gameStateController = gameStateController;

    // Create one each of these controllers, since they handle
    // each client's socket events.
    socket._landingController = new LandingController({ emitter: socket });
    socket._playController = new PlayController({ emitter: socket });

    socket.on('error', function (err) {
      console.log('ERROR!');
      console.log(err);
      console.log(err.stack);
    });
  });
});
