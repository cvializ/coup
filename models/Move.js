function Move(options) {
  options = options || {};

  this.ability = options.ability || null;
  this.detractor = options.detractor || null;
  this.player = options.player || null;
  this.target = options.target || null;

  this.responsesRemaining = 0;
}

Move.prototype.getClientObject = function () {
  var clientObject = {
    player: this.player.getClientObject(),
    detractor: this.detractor && this.detractor.getClientObject(),
    ability: this.ability.getClientObject(),
    target: this.target && this.target.getClientObject()
  };

  return clientObject;
};

Move.prototype.success = function () {
  this.ability.action(this);
};

module.exports = Move;
