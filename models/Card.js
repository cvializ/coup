var uuid = require('node-uuid').v4;

function Card(options) {
  options = options || {};
  this.id = options.id || uuid();
  this.name = options.name || 'Face Down';
  this.eliminated = options.eliminated || false;
  this.dummy = options.dummy || false;
}

module.exports = Card;
