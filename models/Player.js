var uuid = require('node-uuid').v4,
    Card = require('./Card'),
    Influences = require('./Influences');

function Player(options) {
  options = options || {};

  this.id = options.id || uuid();
  this.socket = options.socket || null;
  this.name = options.name || 'Unnamed User';
  this.coins = options.coins || 2;
  this.influences = [];
}

Player.prototype.hasInfluence = function (influenceName) {
  var playerInfluence,
      i;

  for (i = 0; i < this.influences.length; i++) {
    playerInfluence = this.influences[i];

    if (!playerInfluence.eliminated && this.influences[i].name === influenceName) {
      return true;
    }
  }
  return false;
};

Player.prototype.canBlock = function (influenceName, abilityName) {
  var playerInfluence,
      blocks,
      i,
      j;

  for (i = 0; i < this.influences.length; i++) {
    playerInfluence = this.influences[i];

    if (!playerInfluence.eliminated) {
      blocks = Influences[playerInfluence.name].blocks;
      for (j = 0; j < blocks.length; j++) {
        if (blocks[j].influence === influenceName &&
            blocks[j].ability === abilityName) {
          return true;
        }
      }
    }
  }
  return false;
};

Player.prototype.getClientObject = function (options) {
  options = options || {};

  var clientObject = {
    id: this.id,
    name: this.name,
    coins: this.coins,
    influences: this.influences
  };

  if (!options.privileged) {
    clientObject.influences = this.influences.map(function showEliminated(card) {
      if (card.eliminated) {
        return card;
      } else {
        return new Card({ dummy: true }); // an uneliminated card. "mystery card"
      }
    });
  }

  return clientObject;
};

Player.prototype.chooseEliminatedCard = function (callback) {
  var self = this;

  self.socket.emit('select own influence', null, function (err) {
    selectedCardToEliminate.apply(self, arguments);
    if (callback) {
      callback(err);
    }
  });
};

function selectedCardToEliminate(err, data) {
  data = data || {};

  var influences = this.influences,
      dataId = data.id;

  for (var key in influences) {
    if (influences[key].id === dataId) {
      influences[key].eliminated = true;
      break;
    }
  }
}

module.exports = Player;
