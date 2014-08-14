var uuid = require('node-uuid').v4,
    shuffle = require('shuffle').shuffle,
    Card = require('./Card'),
    influenceTypes = ['Ambassador', 'Assassin', 'Captain', 'Contessa', 'Duke'];

function Carousel(collection) {
  this.list = [];
  this.index = 0;

  for (var key in collection) {
    if (collection.hasOwnProperty(key)) {
      this.list.push(collection[key]);
    }
  }
}

Carousel.prototype.next = function () {
  var len = this.list.length;

  if (len === 0) {
    return null;
  }

  this.index = this.getNextIndex();

  return this.list[this.index];
};

Carousel.prototype.getNextIndex = function () {
  return (this.index === this.list.length - 1 ? 0 : this.index + 1);
};

Carousel.prototype.peek = function () {
  return this.list[this.getNextIndex()];
};

function GameState(options) {
  options = options || {};

  var influenceDeck = [];

  if (!options.title) {
    throw 'Property "title" missing from GameState constructor\'s options arg';
  }

  this.id = options.id || uuid();
  this.title = options.title;
  this.players = {};
  this.userCount = 0;
  this.currentMove = null;
  this.deck = [];

  this.started = false;
  this.votesToStart = 0;

  this.carousel = null;
  this.currentPlayer = null;

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 5; j++) {
      influenceDeck.push(new Card({ name: influenceTypes[j] }));
    }
  }

  this.deck = shuffle({ deck: influenceDeck });
}

GameState.prototype.start = function () {
  this.started = true;
  this.carousel = new Carousel(this.players);

  this.nextTurn();
};

GameState.prototype.nextTurn = function () {
  var players = this.players,
      currentPlayer;

  // Get the next eligible player.
  do {
    this.currentPlayer = currentPlayer = this.carousel.next();
  } while (currentPlayer.eliminated);

  currentPlayer.socket.emit('my turn');

  for (var key in players) {
    if (players[key] !== currentPlayer) {
      players[key].socket.emit('new turn', {
        player: currentPlayer.getClientObject()
      });
    }
  }
};

GameState.prototype.won = function () {
  if (activePlayers.length === 1) {
    console.log('A WINNER IS YOU, ' + activePlayers.pop().name);
  }
};

GameState.prototype.addUser = function (player) {
  if (!this.started) {
    this.players[player.id] = player;
    player.influences = this.deck.drawRandom(2);
    this.userCount++;
    this.votesToStart++;
  }
};

GameState.prototype.getClientObject = function () {
  var clientObject = {
    id: this.id,
    title: this.title,
    started: this.started,
    currentPlayer: this.currentPlayer && this.currentPlayer.getClientObject(),
    players: this.players.map(function (p) { return p.getClientObject(); })
  };

  return clientObject;
};

GameState.prototype.removeUser = function (player) {
  delete this.players[player.id];
  this.userCount--;
  this.votesToStart--;
};

GameState.prototype.setCurrentMove = function (currentMove) {
  this.currentMove = currentMove;
  this.currentMove.responsesRemaining = this.userCount - 1;
};

GameState.prototype.getCurrentMove = function () {
  return this.currentMove;
};

module.exports = GameState;
