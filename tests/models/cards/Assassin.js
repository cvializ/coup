var chai = require('chai');
chai.use(require('chai-spies'));

var spy = chai.spy;
var expect = chai.expect;

var GameState = require('../../../models/GameState');
var Move = require('../../../models/Move');
var Player = require('../../../models/Player');

var AssassinAbilities = require('../../../models/cards/Assassin');
var Assassinate = AssassinAbilities['Assassinate'];

describe('"Assassin"', function () {
  describe('#"Assassinate"', function () {
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

    it('should force the target player to eliminate a card', function (done) {
      player2.influences[0].eliminated = true; // force automatic choice

      move = {
        target: player2,
        player: game.currentPlayer
      };

      spy.on(move.target, 'chooseEliminatedCard');

      Assassinate(move, game, function () {
        expect(player2.chooseEliminatedCard).to.be.spy;
        expect(player2.chooseEliminatedCard).to.have.been.called.once;
        done();
      });
    });
  });
});
