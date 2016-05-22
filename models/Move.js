'use strict';

class Move {
  constructor(options) {
    options = options || {};

    this.ability = options.ability || null;
    this.detractor = options.detractor || null;
    this.player = options.player || null;
    this.target = options.target || null;
    this.influence = options.influence || '';

    this.responsesRemaining = 0;
  }

  getClientObject() {
    return {
      player: this.player.getClientObject(),
      detractor: this.detractor && this.detractor.getClientObject(),
      ability: this.ability.getClientObject(),
      target: this.target && this.target.getClientObject(),
      influence: this.influence
    };
  }

  success(game, callback) {
    this.player.coins -= this.ability.cost || 0;
    this.ability.action(this, game, callback);
  }
}

module.exports = Move;
