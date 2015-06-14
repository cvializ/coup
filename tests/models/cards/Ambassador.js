var chai = require('chai');
chai.use(require('chai-spies'));

var spy = chai.spy;
var expect = chai.expect;

var GameState = require('../../../models/GameState');
var Move = require('../../../models/Move');
var Player = require('../../../models/Player');

var AmbassadorAbilities = require('../../../models/cards/Ambassador');
var ExchangeInfluence = AmbassadorAbilities['Exchange Influence'];

describe('"Ambassador Abilities"', function () {
  describe('#"Exchange Influence"', function () {
    var move;
    var game;
    var players;
    var player;

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

    it('should replace the two uneliminated cards with cards from the deck', function (done) {
      move = {
        target: null,
        player: game.currentPlayer
      };

      spy.on(game.deck, 'drawRandom');

      ExchangeInfluence(move, game, function () {
        expect(game.deck.drawRandom).to.be.spy;
        expect(game.deck.drawRandom).to.have.been.called.twice;
        done();
      });
    });

    it('should replace the only the one uneliminated card with a card from the deck', function (done) {
      game.currentPlayer.influences[0].eliminated = true;

      move = {
        target: null,
        player: game.currentPlayer
      };

      spy.on(game.deck, 'drawRandom');

      ExchangeInfluence(move, game, function () {
        expect(game.deck.drawRandom).to.be.spy;
        expect(game.deck.drawRandom).to.have.been.called.once;
        done();
      });
    });
  });
});
