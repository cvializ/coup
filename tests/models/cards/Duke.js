var chai = require('chai');
chai.use(require('chai-spies'));

var spy = chai.spy;
var expect = chai.expect;

var GameState = require('../../../models/GameState');
var Move = require('../../../models/Move');
var Player = require('../../../models/Player');

var DukeAbilities = require('../../../models/cards/Duke');
var Treasury = DukeAbilities['Treasury'];

describe('"Duke"', function () {
  describe('#"Treasury"', function () {
    var move;
    var game;
    var players;
    var player1;
    var player2;
    var player3;

    beforeEach(function () {
      game = new GameState({ title: 'Test Game' });
      players = [
        player1 = new Player({ name: 'Anne' }),
        player2 = new Player({ name: 'Betty' }),
        player3 = new Player({ name: 'Charlie' })
      ];
      game.addUser(players.shift());
      game.addUser(players.shift());
      game.start();
    });

    it('should steal two coins from the target player', function (done) {
      move = {
        target: null,
        player: game.currentPlayer
      };

      expect(move.player.coins).to.equal(2);

      Treasury(move, game, function () {
        expect(move.player.coins).to.equal(5);
        done();
      });
    });
  });
});
