var expect = require('chai').expect,
    Player = require('../../models/Player'),
    GameState = require('../../models/GameState');

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
      expect(game.currentPlayer.name).to.equal(player1.name);
      player2.eliminated = true;
      game.nextTurn();
      expect(game.currentPlayer.name).to.equal(player3.name);
    });
  });
});
