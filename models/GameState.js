var uuid = require('node-uuid').v4,
    shuffle = require('shuffle').shuffle,
    Card = require('./Card'),
    Carousel = require('./Carousel'),
    io = require('../server').io,
    emitter = require('../emitter'),
    influenceTypes = ['Ambassador', 'Assassin', 'Captain', 'Contessa', 'Duke'];

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

  if (this.won()) {
    var winner = this.getRemainingPlayers().pop();
    io.sockets.to(this.id).emit('game over', { winner: winner.getClientObject() });
  } else {
    // Tell the current play it's their turn
    currentPlayer.socket.emit('my turn');

    // Tell everyone else that it's not their turn
    for (var key in players) {
      if (players[key] !== currentPlayer) {
        players[key].socket.emit('new turn', {
          player: currentPlayer.getClientObject()
        });
      }
    }
  }

  emitter.emit('push:game', {
    destination: io.sockets.to(this.id),
    game: this.getClientObject()
  });
};

GameState.prototype.getRemainingPlayers = function () {
  var list = [],
      key;

  for (key in this.players) {
    if (!this.players[key].eliminated) {
      list.push(this.players[key]);
    }
  }

  return list;
};

GameState.prototype.won = function () {
  return this.getRemainingPlayers().length === 1;
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
    players: []
  },
  playerList = clientObject.players,
  key;

  for (key in this.players) {
    playerList.push(this.players[key].getClientObject());
  }

  return clientObject;
};

GameState.prototype.removeUser = function (player) {
  delete this.players[player.id];
  this.userCount--;
  this.votesToStart--;
};

GameState.prototype.setCurrentMove = function (currentMove) {
  var activePlayerCount = 0,
      key;
  for (key in this.players) {
    if (!this.players[key].eliminated) {
      activePlayerCount++;
    }
  }

  this.currentMove = currentMove;
  this.currentMove.responsesRemaining = activePlayerCount - 1;
};

GameState.prototype.getCurrentMove = function () {
  return this.currentMove;
};

module.exports = GameState;
