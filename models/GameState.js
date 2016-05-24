'use strict';

const uuid = require('node-uuid').v4,
      shuffle = require('shuffle').shuffle,
      Card = require('./Card'),
      Carousel = require('./Carousel'),
      io = require('../server').io,
      emitter = require('../emitter'),
      ServerConstants = require('../app/js/constants/server'),
      CARD_TYPES = Card.TYPES;

class GameState {
  constructor(options) {
    options = options || {};

    const influenceDeck = [],
          cardTypeCount = CARD_TYPES.length,
          cardsPerType = options.cardsPerType || 3;

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

    for (let i = 0; i < cardsPerType; i++) {
      for (let j = 0; j < cardTypeCount; j++) {
        influenceDeck.push(new Card({ name: CARD_TYPES[j] }));
      }
    }

    this.deck = shuffle({ deck: influenceDeck });
  }

  start() {
    if (this.userCount > 1) {
      this.started = true;
      this.carousel = new Carousel(this.players);

      this.nextTurn();
    }
  }

  nextTurn(options) {
    options = options || {};

    if (!this.started) {
      return;
    }
    const players = this.players;
    let currentPlayer = this.currentPlayer;

    if(!options.restartTurn) {
      // Get the next eligible player and
      // skip over eliminated players.
      do {
        // assign both the original reference and the shortcut
        this.currentPlayer = currentPlayer = this.carousel.next();
      } while (currentPlayer && currentPlayer.eliminated);
    }

    if (this.won()) {
      const winner = this.getRemainingPlayers().pop();
      emitter.emit(ServerConstants.GAME_OVER, {
        destination: io.sockets.to(this.id),
        winner: winner.getClientObject()
      });
    } else {
      if (this.userCount > 1) {
        // Tell the current play it's their turn
        emitter.emit(ServerConstants.MY_TURN, { destination: currentPlayer.socket });

        // Tell everyone else that it's not their turn
        for (let key in players) {
          if (players[key] !== currentPlayer) {
            emitter.emit(ServerConstants.NEW_TURN, {
              destination: players[key].socket,
              player: currentPlayer.getClientObject()
            });
          }
        }
      }
    }

    emitter.emit(ServerConstants.PUSH_GAME, {
      destination: io.sockets.to(this.id),
      game: this.getClientObject()
    });
  }

  getRemainingPlayers() {
    const list = [];

    for (let key in this.players) {
      if (!this.players[key].eliminated) {
        list.push(this.players[key]);
      }
    }

    return list;
  }

  won() {
    return this.getRemainingPlayers().length === 1;
  }

  addUser(player) {
    if (!this.started) {
      this.players[player.id] = player;

      player.order = this.userCount;
      player.influences = this.deck.drawRandom(2);

      this.userCount++;
      this.votesToStart++;
    }
  }

  getClientObject(options) {
    options = options || {};

    const clientObject = {
      id: this.id,
      title: this.title,
      started: this.started,
      currentPlayer: this.currentPlayer && this.currentPlayer.getClientObject(),
      players: []
    },
    playerList = clientObject.players;

    for (let key in this.players) {
      playerList.push(this.players[key].getClientObject());
    }

    return clientObject;
  }

  removeUser(player) {
    delete this.players[player.id];
    this.userCount--;

    if (!this.started) {
      this.votesToStart = this.votesToStart - 1;
      if (this.votesToStart === 0) {
        this.start();
      }
    } else {
      this.carousel.remove(player);

      // Put the player's cards back in the deck
      this.deck.putOnTopOfDeck(player.influences);
      this.deck.shuffle();

      if (!this.won()) {
        if (player === this.currentPlayer) {
          //console.log('skip this guy');
          this.nextTurn();
        } else {
          //console.log('let\'s try this again');
          this.nextTurn({ restartTurn: true });
        }
      }
    }
  }

  setCurrentMove(currentMove) {
    this.currentMove = currentMove;
    this.currentMove.responsesRemaining = this.getRemainingPlayers().length - 1;
  }

  getCurrentMove() {
    return this.currentMove;
  }
}

module.exports = GameState;
