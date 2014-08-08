var
    // Server variables
    server = require('./server'),
    io = server.io,
    emitter = require('./emitter'),

    // Controllers
    LandingController = require('./controllers/Landing'),
    PlayController = require('./controllers/Play'),
    GameDataController = require('./controllers/GameData');

io.on('connection', function (socket) {
  socket.join('landing');

  var lc = new LandingController({ emitter: socket }),
      pc = new PlayController({ emitter: socket }),
      gdc = new GameDataController({ emitter: emitter });

  socket.on('error', function (err) {
    console.log('ERROR!');
    console.log(err);
  });
});
