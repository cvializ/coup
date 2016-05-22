'use strict';

const uuid = require('node-uuid').v4,
      Card = require('./Card'),
      Influences = require('./Influences'),
      emitter = require('../emitter'),
      ServerConstants = require('../app/js/constants/server');

class Player {
  constructor(options) {
    options = options || {};

    this.id = options.id || uuid();
    this.socket = options.socket || null;
    this.name = options.name || 'Unnamed User';
    this.coins = options.coins || 2;
    this.influences = [];
    this.eliminated = false;
    this.order = options.order || 0;
  }

  hasInfluence(influenceName) {
    for (let i = 0; i < this.influences.length; i++) {
      let playerInfluence = this.influences[i];

      if (!playerInfluence.eliminated && this.influences[i].name === influenceName) {
        return true;
      }
    }
    return false;
  }

  canBlock(influenceName, abilityName) {
    for (let i = 0; i < this.influences.length; i++) {
      let playerInfluence = this.influences[i];

      if (!playerInfluence.eliminated) {
        let blocks = Influences[playerInfluence.name].blocks;
        for (let j = 0; j < blocks.length; j++) {
          if (blocks[j].influence === influenceName &&
              blocks[j].ability === abilityName) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getClientObject(options) {
    options = options || {};

    const clientObject = {
      id: this.id,
      name: this.name,
      coins: this.coins,
      influences: this.influences,
      eliminated: this.eliminated
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
  }

  chooseEliminatedCard(callback) {
    const activeCards = this.influences.filter(cardIsActive);

    // If the user has multiple cards left, actually let them choose which one
    // to give up
    if (activeCards.length > 1) {
      emitter.emit(ServerConstants.SELECT_OWN_INFLUENCE, { destination: this.socket }, (err, data) => {
        data = data || {};

        this.eliminateCard(data.id);
        if (callback) {
          callback(err, { noDoubleEliminate: true });
        }
      });
    } else {
      if (activeCards.length) {
        // If the user only has one card left, get rid of it for them.
        this.eliminateCard(activeCards.pop().id);
      }
      callback(undefined, { noDoubleEliminate: true });
    }
  }

  eliminateCard(cardId) {
    const influences = this.influences,
          card = influences.filter(function (d) { return d.id === cardId; }).pop();

    if (card) {
      card.eliminated = true;
      // If there are no active cards, the player is eliminated
      this.eliminated = (this.influences.filter(cardIsActive).length < 1);
    }
  }
}

function cardIsActive(card) {
  return !card.eliminated;
}

module.exports = Player;
