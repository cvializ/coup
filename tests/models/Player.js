var expect = require('chai').expect,
    Player = require('../../models/Player'),
    Card = require('../../models/Card'),
    MockController = require('../../controllers/Mock'),
    emitter = require('../../emitter');

describe('Player', function () {
  var player,
      influences;

  beforeEach(function (done) {
    player = new Player({ name: 'Frank', socket: null });
    influences = [
      new Card({ name: 'Ambassador' }),
      new Card({ name: 'Contessa' })
    ];
    player.influences = influences;

    done();
  });

  describe('#chooseEliminatedCard', function () {
    var mockController;

    beforeEach(function () {
      mockController = new MockController({
        emitter: emitter,
        events: {
          'select own influence': function selectInfluence(options, callback) {
            var influences = player.influences,
                key;

            // Select the player's card for them
            for (key in influences) {
              if (!influences[key].eliminated) {
                callback(undefined, { id: influences[key].id });
                return;
              }
            }

            callback(player.name + ' has no uneliminated influences.');
          }
        }
      });
    });

    it('should offer the user a choice of which card to remove', function (done) {
      player.chooseEliminatedCard(function (err) {
        expect(err).to.not.exist;
        expect(influences[0].eliminated).to.equal(true);
        mockController.stop();
        done();
      });
    });

    it('should automatically remove the player\'s last card', function (done) {
      influences[0].eliminated = true;

      player.chooseEliminatedCard(function (err) {
        expect(err).to.not.exist;
        expect(influences[1].eliminated).to.equal(true);
        mockController.stop();
        done();
      });
    });
  });

  describe('#hasInfluence', function () {
    it('should return true if the player has an influence and it is not eliminated', function () {
      expect(player.hasInfluence('Contessa')).to.equal(true);
    });

    it('should return false if the player does not possess an influence card', function () {
      expect(player.hasInfluence('Assassin')).to.equal(false);
    });

    it('should return false if the player possesses the card, but it is eliminated', function () {
      var ambassador = influences.filter(function (card) { return card.name === 'Ambassador'; }).pop();

      expect(player.hasInfluence(ambassador.name)).to.equal(true);
      ambassador.eliminated = true;
      expect(player.hasInfluence(ambassador.name)).to.equal(false);
    });
  });

  describe('#canBlock', function () {
    it('should return true if the player possesses a card that can block the given move', function () {
      expect(player.canBlock('Assassin', 'Assassinate')).to.equal(true);
    });

    it('should return false if the player lacks a card that blocks the given move', function () {
      expect(player.canBlock('Default', 'Foreign Aid')).to.equal(false);
    });

    it('should return false if the given influence or ability don\'t exist', function () {
      expect(player.canBlock('Foo', 'Bar')).to.equal(false);
    });
  });

  describe('#eliminateCard', function () {
    it('should set the card with the given id to eliminated', function () {
      var ambassador = influences.filter(function (card) { return card.name === 'Ambassador'; }).pop();

      expect(ambassador.eliminated).to.equal(false);
      player.eliminateCard(ambassador.id);
      expect(ambassador.eliminated).to.equal(true);
    });

    it('should eliminate the player when they have eliminated all influence', function () {
      var ambassador = influences.filter(function (card) { return card.name === 'Ambassador'; }).pop(),
          contessa = influences.filter(function (card) { return card.name === 'Contessa'; }).pop();

      expect(player.eliminated).to.equal(false);

      player.eliminateCard(ambassador.id);
      player.eliminateCard(contessa.id);

      expect(player.eliminated).to.equal(true);
    });
  });

  describe('#getClientObject', function () {
    it('should not expose uneliminated cards to other users', function () {
      var clientObject = player.getClientObject({ privileged: false }),
          clientInfluences = clientObject.influences,
          i;

      for (i = 0; i < clientInfluences.length; i++) {
        expect(clientInfluences[i].dummy).to.equal(true);
      }
    });

    it('should expose eliminated cards to other users', function () {
      var clientObject,
          clientInfluences,
          i;

      for (i = 0; i < influences.length; i++) {
        influences[i].eliminated = true;
      }

      clientObject = player.getClientObject({ privileged: false });
      clientInfluences = clientObject.influences;

      for (i = 0; i < clientInfluences.length; i++) {
        expect(clientInfluences[i].dummy).to.equal(false);
      }
    });

    it('should expose all cards to the player who owns them', function () {
      var clientObject = player.getClientObject({ privileged: true }),
          clientInfluences = clientObject.influences,
          i;

      for (i = 0; i < clientInfluences.length; i++) {
        expect(clientInfluences[i].dummy).to.equal(false);
      }
    });
  });

});
