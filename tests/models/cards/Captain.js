var chai = require('chai');
chai.use(require('chai-spies'));

var spy = chai.spy;
var expect = chai.expect;

var GameState = require('../../../models/GameState');
var Move = require('../../../models/Move');
var Player = require('../../../models/Player');

var CaptainAbilities = require('../../../models/cards/Captain');
var Steal = CaptainAbilities['Steal'];

describe('"Captain"', function () {
  describe('#"Steal"', function () {
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
        target: player2,
        player: game.currentPlayer
      };

      expect(player2.coins).to.equal(2);

      Steal(move, game, function () {
        expect(player2.coins).to.equal(0);
        done();
      });
    });

    it('should steal one coin from the target player if they only have one coin', function (done) {
      move = {
        target: player2,
        player: game.currentPlayer
      };

      player2.coins = 1;

      expect(player2.coins).to.equal(1);

      Steal(move, game, function () {
        expect(player2.coins).to.equal(0);
        done();
      });
    });
  });
});
