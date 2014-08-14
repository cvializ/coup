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
  this.eliminated = false;
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
  var self = this,
      activeCards = self.influences.filter(cardIsActive);

  // If the user has multiple cards left, actually let them choose which one
  // to give up
  if (activeCards.length > 1) {
    self.socket.emit('select own influence', null, function (err, data) {
      data = data || {};

      self.eliminateCard(data.id);
      if (callback) {
        callback(err, { noDoubleEliminate: true });
      }
    });
  } else {
    if (activeCards.length) {
      // If the user only has one card left, get rid of it for them.
      self.eliminateCard(activeCards.pop().id);
    }
    callback(undefined, { noDoubleEliminate: true });
  }
};

Player.prototype.eliminateCard = function(cardId) {
  var influences = this.influences,
      card = influences.filter(function (d) { return d.id === cardId; }).pop();

  if (card) {
    card.eliminated = true;
    // If there are no active cards, the player is eliminated
    this.eliminated = (this.influences.filter(cardIsActive).length < 1);
  }
};

function cardIsActive(card) {
  return !card.eliminated;
}

module.exports = Player;
