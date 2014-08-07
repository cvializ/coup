var
    // Model objects
    GameState = require('./models/GameState'),
    Player = require('./models/Player'),
    Move = require('./models/Move'),
    Ability = require('./models/Ability'),
    Influences = require('./models/Influences'),

    // Server variables
    server = require('./server.js'),
    io = server.io,

    // State
    games = require('./models/GameCollection');

    // Controllers
    LandingController = require('./controllers/Landing'),
    PlayController = require('./controllers/Play');

io.on('connection', function (socket) {
  socket.join('landing');

  var lc = new LandingController({ socket: socket }),
      pc = new PlayController({ socket: socket });

  socket.on('error', function (err) {
    console.log('ERROR!');
    console.log(err);
  });
});
