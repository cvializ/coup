var expect = require('chai').expect,
    GameState = require('../../models/GameState');

describe('GameState', function () {
  var game;

  beforeEach(function (done) {
    game = new GameState({ title: 'Test Game' });
    done();
  });

  describe('#constructor', function () {
    it('should create and maintain the deck of influence cards', function () {
      expect(game.deck.length).to.equal(3 * 5);
    });
  });
});
