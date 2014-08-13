/* jshint unused: false */
var
    // Server variables
    server = require('./server'),
    io = server.io,
    emitter = require('./emitter'),

    // Controllers
    LandingController = require('./controllers/Landing'),
    PlayController = require('./controllers/Play'),
    GameDataController = require('./controllers/GameData'),

    // instantiate this controller only once, since it listens for
    // server-side events only and thus only needs to be created once.
    gdc = new GameDataController({ emitter: emitter });

io.on('connection', function (socket) {
  socket.join('landing');

  // Create one each of these controllers, since they handle
  // each client's socket events.
  var lc = new LandingController({ emitter: socket }),
      pc = new PlayController({ emitter: socket });

  socket.on('error', function (err) {
    console.log('ERROR!');
    console.log(err);
  });
});
