var uuid = require('node-uuid').v4,
    Card = require('./Card');

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

module.exports = Player;