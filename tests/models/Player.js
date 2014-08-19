var expect = require('chai').expect,
    Player = require('../../models/Player'),
    Card = require('../../models/Card'),
    BaseController = require('../../controllers/Base'),
    emitter = require('../../emitter'),
    MockPlayerController,
    player;

// Use this to intercept the Player object's attempt to communicate with
// the client. Mock the client choosing their first uneliminated card.
MockPlayerController = BaseController.extend({
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

describe('Player', function () {
  var controller,
      influences;

  beforeEach(function (done) {
    player = new Player({ name: 'Frank', socket: null });
    influences = [
      new Card({ name: 'Ambassador' }),
      new Card({ name: 'Contessa' })
    ];
    player.influences = influences;
    controller = new MockPlayerController({ emitter: emitter });

    done();
  });

  afterEach(function (done) {
    controller.stop();
    done();
  });

  describe('#chooseEliminatedCard', function () {
    it('should offer the user a choice of which card to remove (the first one)', function () {
      player.chooseEliminatedCard(function (err) {
        expect(err).to.equal(undefined);
        expect(influences[0].eliminated).to.equal(true);
      })
    });
  });

});
