var expect = require('chai').expect,
    Player = require('../../models/Player'),
    GameState = require('../../models/GameState'),
    MockController = require('../../controllers/Mock'),
    emitter = require('../../emitter');

describe('GameState', function () {
  var game,
      players,
      player1,
      player2,
      player3;

  beforeEach(function (done) {
    game = new GameState({ title: 'Test Game' });
    players = [
      player1 = new Player({ name: 'Anne' }),
      player2 = new Player({ name: 'Betty' }),
      player3 = new Player({ name: 'Charlie' })
    ];
    done();
  });

  describe('#constructor', function () {
    it('should create and maintain the deck of influence cards', function () {
      expect(game.deck).to.have.length(3 * 5);
    });
  });

  describe('#addUser', function () {
    var player;

    beforeEach(function (done) {
      player = players.shift();
      game.addUser(player);
      done();
    });

    it('should add a user to the game', function () {
      expect(game.userCount).to.equal(1);
      expect(game.votesToStart).to.equal(1);
    });

    it('should assign the user two influences that were removed from the deck', function () {
      expect(player.influences).to.have.length(2);
      expect(game.deck).to.have.length(13);
    });
  });

  describe('#removeUser', function () {
    beforeEach(function (done) {
      for (var i = 0; i < players.length; i++) {
        game.addUser(players.shift());
      }
      done();
    });
  });

  describe('#start', function () {
    var player;

    beforeEach(function (done) {
      player = players.shift();
      game.addUser(player);
      done();
    });

    it('should not start if the game has only one user', function () {
      game.start();
      expect(game.started).to.equal(false);
    });

    it('should start if the game has more than one player', function () {
      game.addUser(players.shift());
      game.start();
      expect(game.started).to.equal(true);
    });

    it('should let the first player to join have the first turn', function () {
      game.addUser(players.shift());
      game.start();
      expect(game.currentPlayer.name).to.equal(player1.name);
    });

    it('should initialize the carousel', function () {
      game.addUser(players.shift());
      game.start();
      expect(game.carousel).to.not.equal(null);
    });
  });

  describe('#getRemainingPlayers', function () {
    beforeEach(function (done) {
      game.addUser(players.shift());
      game.addUser(players.shift());
      game.addUser(players.shift());
      game.start();
      done();
    });

    it('should return a list of players with at least one non-eliminated card', function () {
      var remainingPlayers;

      player1.eliminated = true;
      remainingPlayers = game.getRemainingPlayers();

      expect(2).to.equal(remainingPlayers.length);
      expect(-1).to.equal(remainingPlayers.indexOf(player1));
    });
  });

  describe('#won', function () {
    it('should be true if only one player remains', function () {
      game.addUser(players.shift());
      game.addUser(players.shift());
      game.addUser(players.shift());

      player1.eliminated = player2.eliminated = true;

      expect(true).to.equal(game.won());
    });
  });

  describe('#nextTurn', function () {
    beforeEach(function (done) {
      game.addUser(players.shift());
      game.addUser(players.shift());
      game.addUser(players.shift());
      done();
    });

    it('should not have any side effect if called before game.start', function () {
      game.nextTurn();
      expect(game.currentPlayer).to.equal(null);
    });

    it('should be called on game.start and set the currentPlayer',  function () {
      game.start();
      expect(game.currentPlayer).to.not.equal(null);
    });

    it('should skip over eliminated players', function () {
      game.start();
      expect(player1.name).to.equal(game.currentPlayer.name);
      player2.eliminated = true;
      game.nextTurn();
      expect(player3.name).to.equal(game.currentPlayer.name);
    });

    it('should inform participants that the last remaining player has won the game.', function (done) {
      var mockController;

      mockController = new MockController({
        emitter: emitter,
        events: {
          'game over': function gameOver(data) {
            expect(data.winner).to.deep.equal(player2.getClientObject());
            done();
            this.stop();
          }
        }
      });

      game.start();
      player1.eliminated = true;
      player3.eliminated = true;
      game.nextTurn();
    });

    it('should inform participants of new turns', function (done) {
      var mockController;

      game.start();

      mockController = new MockController({
        emitter: emitter,
        remainingResponses: 3,
        events: {
          'respond': function doneAfterAllRespond() {
            var remaining = --this.options.remainingResponses;
            if (remaining === 0) {
              // Success!
              done();
              this.stop();
            }
          },
          'my turn': function myTurn() {
            emitter.emit('respond');
          },
          'new turn': function newTurn(data) {
            expect(player2.getClientObject()).to.deep.equal(data.player);
            emitter.emit('respond');
          }
        }
      });

      game.nextTurn();
    });

    it('should send the game data to all of its players', function (done) {
      var mockController;

      game.start();

      mockController = new MockController({
        emitter: emitter,
        events: {
          'push:game': function pushGame(data) {
            expect(game.getClientObject()).to.deep.equal(data.game);
            done();
            this.stop();
          }
        }
      });

      game.nextTurn();
    });
  });
});
