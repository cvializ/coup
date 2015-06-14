var chai = require('chai');
chai.use(require('chai-spies'));

var spy = chai.spy;
var expect = chai.expect;

var GameState = require('../../../models/GameState');
var Move = require('../../../models/Move');
var Player = require('../../../models/Player');

var DefaultAbilities = require('../../../models/cards/Default');
var Income = DefaultAbilities['Income'];
var ForeignAid = DefaultAbilities['Foreign Aid'];
var Coup = DefaultAbilities['Coup'];

describe('"Default"', function () {
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

  describe('#"Income"', function () {
    it('should give one coin to the player', function (done) {
      move = {
        target: null,
        player: game.currentPlayer
      };

      expect(move.player.coins).to.equal(2);

      Income(move, game, function () {
        expect(move.player.coins).to.equal(3);
        done();
      });
    });
  });

  describe('#"Foreign Aid"', function () {
    it('should give two coins to the player', function (done) {
      move = {
        target: null,
        player: game.currentPlayer
      };

      expect(move.player.coins).to.equal(2);

      ForeignAid(move, game, function () {
        expect(move.player.coins).to.equal(4);
        done();
      });
    });
  });

  describe('#"Coup"', function () {
    it('should force the target player to eliminate a card', function (done) {
      player2.influences[0].eliminated = true; // force automatic choice

      move = {
        target: player2,
        player: game.currentPlayer
      };

      spy.on(move.target, 'chooseEliminatedCard');

      Coup(move, game, function () {
        expect(player2.chooseEliminatedCard).to.be.spy;
        expect(player2.chooseEliminatedCard).to.have.been.called.once;
        done();
      });
    });
  });
});
