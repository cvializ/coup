'use strict';

const uuid = require('node-uuid').v4;

class Card {
  constructor(options) {
    options = options || {};

    if (options.dummy) {
      this.id = 'dummy';
    } else {
      this.id = options.id || uuid();
    }
    this.name = options.name || 'Face Down';
    this.eliminated = options.eliminated || false;
    this.dummy = options.dummy || false;
  }
}
Card.TYPES = ['Ambassador', 'Assassin', 'Captain', 'Contessa', 'Duke'];

module.exports = Card;
