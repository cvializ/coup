function Card(options) {
  options = options || {};
  this.name = options.name || 'Uneliminated';
  this.eliminated = options.eliminated || false;
}

module.exports = Card;