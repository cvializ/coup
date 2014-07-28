function Ability(options) {
  this.name = options.name || '';
  this.blockable = options.blockable || false;
  this.needsTarget = options.needsTarget || false;
  this.voting = options.voting || 'none';
  this.influence = options.influence || null; // card
  this.doubtable = (this.influence !== 'Default');
  this.action = options.action || null;
}

Ability.prototype.getClientObject = function () {
  return {
    name: this.name,
    blockable: this.blockable,
    needsTarget: this.needsTarget,
    voting: this.voting,
    influence: this.influence,
    doubtable: this.doubtable
  };
};

module.exports = Ability;
