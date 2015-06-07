var expect = require('chai').expect,
    Player = require('../../models/Player'),
    GameCollection = require('../../models/GameCollection'),
    emitter = require('../../emitter'),
    EventEmitter = require('events').EventEmitter,
    LandingController = require('../../controllers/Landing');

describe('Landing Controller', function () {
  var controller;
  var socket;
  var serverEmitter;
  var io;
  var games;

  beforeEach(function (done) {
    io = {
      to: function (room) {
        return socket;
      },
      sockets: {
        to: function (room) {
          return socket;
        }
      }
    };

    socket = new EventEmitter();
    socket.join = function () {};
    socket.leave = function () {};
    socket.broadcast = io;
    serverEmitter = new EventEmitter();
    games = new GameCollection();

    controller = new LandingController({
      emitter: socket,
      serverEmitter: serverEmitter,
      io: io,
      games: games
    });
    done();
  });

  describe('#"create game"', function () {
    it('should report an error if the title is missing', function () {
      socket.emit('create game', { /* missing title */ }, function (err) {
        expect(err).to.equal('missing title');
      });
    });

    it('should report an error if the username is missing', function () {
      socket.emit('create game', { title: 'cool game' /* missing username */}, function (err) {
        expect(err).to.equal('missing username');
      });
    });

    it('should create a game successfully if all data needed is present', function () {
      socket.emit('create game', { title: 'cool game', username: 'bob' }, function (err, data) {
        expect(err).to.not.exist;
        expect(data.username).to.equal('bob');
        expect(data.id).to.exist;
      });
    });

    it('should report an error if a game with the same title exists', function () {
      socket.emit('create game', { title: 'cool game', username: 'bob' }, function (err, data) {
        expect(err).to.not.exist;
        expect(data.username).to.equal('bob');
        expect(data.id).to.exist;
      });
      socket.emit('create game', { title: 'cool game', username: 'bob 2' }, function (err) {
        expect(err).to.equal('game exists');
      });
    });
  });

  describe('#"ready"', function () {
    it('should publish the "push:game:collection" event', function (done) {
      serverEmitter.on('push:game:collection', function (data) {
        expect(data).to.exist;
        expect(data.destination).to.equal(socket);
        expect(data.games).to.exist;
        done();
      });

      socket.emit('ready');
    });
  });

  describe('#"join user"', function () {
    var gameId;

    beforeEach(function (done) {
      socket.emit('create game', { title: 'cool game', username: 'bob' }, function (err, data) {
        gameId = data.id;
        done();
      });
    });

    it('should report an error for an invalid username', function (done) {
      socket.emit('join user', { /* missing username */ }, function (err) {
        expect(err).to.equal('invalid username');
        done();
      });
    });

    it('should report an error for an invalid game id', function (done) {
      socket.emit('join user', { username: 'frank' /* missing id */ }, function (err) {
        expect(err).to.equal('invalid game id');
        done();
      });
    });

    it('should report an error if the game has already started', function (done) {
      var game = games[gameId],
          player1 = new Player({ name: 'Anne' }),
          player2 = new Player({ name: 'Betty' });

      game.addUser(player1);
      game.addUser(player2);
      game.start();

      socket.emit('join user', { username: 'frank', id: gameId }, function (err) {
        expect(err).to.equal('that game is already in progress');
        done();
      });
    });

    it('should add the player to the game, leave the landing, and let other players know a player has joined', function () {
      socket.join = function (room) {
        expect(room).to.equal(gameId);
      };
      socket.leave = function (room) {
        expect(room).to.equal('landing');
      };

      socket.emit('join user', { username: 'frank', id: gameId }, function () {
        // callback doesn't receive any args
      });
    });
  });

  describe('#"remove user" and #"disconnect"', function () {
    var gameId;
    beforeEach(function (done) {
      socket.emit('create game', { title: 'cool game', username: 'bob' }, function (err, data) {
        gameId = data.id;

        socket.emit('join user', { username: 'frank', id: gameId }, function () {
          done();
        });
      });
    });

    it('should join the landing when logging out', function (done) {
      socket.join = function (room) {
        expect(room).to.equal('landing');
        done();
      };

      socket.emit('remove user');
    });

    it('should delete the game if the user is the last one to leave', function (done) {
      socket.broadcast.to = function (destination) {
        expect(destination).to.equal(gameId);
        return socket;
      };

      socket.on('user left', function (data) {
        expect(data.username).to.equal('frank');
        done();
      });

      socket.emit('remove user');
    });
  });
});
