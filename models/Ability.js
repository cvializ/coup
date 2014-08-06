function Ability(options) {
  this.name = options.name || '';

  this.influence = options.influence || null; // card
  this.doubtable = (this.influence !== 'Default');
  this.blockable = options.blockable || false;

  this.action = options.action || null;
  this.cost = options.cost || 0;
  this.needsTarget = options.needsTarget || false;
}

Ability.prototype.getClientObject = function () {
  return {
    name: this.name,

    influence: this.influence,
    doubtable: this.doubtable,
    blockable: this.blockable,

    cost: this.cost,
    needsTarget: this.needsTarget
  };
};

module.exports = Ability;
