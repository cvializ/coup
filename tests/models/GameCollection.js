var expect = require('chai').expect,
    GameState = require('../../models/GameState'),
    GameCollection = require('../../models/GameCollection');

describe('GameCollection', function () {
  var collection,
      game = new GameState({ title: 'cool game' });

  beforeEach(function () {
    collection = new GameCollection();
  });

  describe('#exists', function () {
    it('should return false for all input when the collection is empty', function () {
      expect(collection.gameExists('game')).to.equal(false);
    });

    it('should return true when the desired game exists', function () {
      collection[game.title] = game;
      expect(collection.gameExists(game.title)).to.equal(true);
    });

    it('should return false when the desired game does not exist', function () {
        collection[game.title] = game;
        expect(collection.gameExists('my lame game')).to.equal(false);
    });
  });
});
