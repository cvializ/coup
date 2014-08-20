var expect = require('chai').expect,
    Player = require('../../models/Player'),
    GameState = require('../../models/GameState');

describe('GameState', function () {
  var game,
      player,
      player2;

  beforeEach(function (done) {
    game = new GameState({ title: 'Test Game' });
    player = new Player({ name: 'Frank' });
    player2 = new Player({ name: 'Jesus' });

    done();
  });

  describe('#constructor', function () {
    it('should create and maintain the deck of influence cards', function () {
      expect(game.deck).to.have.length(3 * 5);
    });
  });

  describe('#addUser', function () {

    beforeEach(function (done) {
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
    beforeEach(function (done) {
      game.addUser(player);
      done();
    });

    it('should not start if the game has only one user', function () {
      game.start();
      expect(game.started).to.equal(false);
    });

    it('should start if the game has more than one player', function () {
      game.addUser(player2);
      game.start();
      expect(game.started).to.equal(true);
    });

    it('should initialize the carousel', function () {
      game.addUser(player2);
      game.start();
      expect(game.carousel).to.not.equal(null);
    });
  });
});
