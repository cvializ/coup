var uuid = require('node-uuid').v4,
    shuffle = require('shuffle').shuffle,
    Card = require('./Card');

function GameState(options) {
  options = options || {};

  var influenceTypes = ['Ambassador', 'Assassin', 'Captain', 'Contessa', 'Duke'],
      influenceDeck = [];

  if (!options.title) {
    throw 'Property "title" missing from GameState constructor\'s options arg';
  }

  this.id = options.id || uuid();
  this.title = options.title;
  this.players = {};
  this.userCount = 0;
  this.currentMove = null;
  this.deck = [];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 5; j++) {
      influenceDeck.push(new Card({ name: influenceTypes[j] }));
    }
  }

  this.deck = shuffle({ deck: influenceDeck });
}

GameState.prototype.addUser = function (player) {
  this.players[player.id] = player;
  player.influences = this.deck.drawFromBottomOfDeck(2);
  this.userCount++;
};

GameState.prototype.getClientObject = function () {
  var clientObject = {
    id: this.id,
    title: this.title,
    players: []
  },
  player;

  for (var key in this.players) {
    player = this.players[key];
    clientObject.players.push(player.getClientObject());
  }

  return clientObject;
};

GameState.prototype.removeUser = function (player) {
  delete this.players[player.id];
  this.userCount--;
};

GameState.prototype.setCurrentMove = function (currentMove) {
  this.currentMove = currentMove;
  this.currentMove.responsesRemaining = this.userCount - 1;
};

GameState.prototype.getCurrentMove = function () {
  return this.currentMove;
};

module.exports = GameState;
