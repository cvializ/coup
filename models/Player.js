var uuid = require('node-uuid').v4;

function Player(options) {
  options = options || {};

  this.id = options.id || uuid();
  this.socket = options.socket || null;
  this.name = options.name || 'Unnamed User';
  this.coins = options.coins || 2;
}

Player.prototype.getClientObject = function () {
  return {
    id: this.id,
    name: this.name,
    coins: this.coins
  };
};

module.exports = Player;
