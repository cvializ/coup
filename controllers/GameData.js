'use strict';

const BaseController = require('./Base'),
      ServerConstants = require('../app/js/constants/server'),
      SocketConstants = require('../app/js/constants/socket');

class GameDataController extends BaseController {

  get constants() {
    return ServerConstants;
  }

  get events() {
    return {
      PUSH_GAME(options) {
        options = options || {};

        if (options.destination) {
          options.destination.emit(SocketConstants.PUSH_GAME, options.game);
        }
      },

      PUSH_GAME_COLLECTION(options) {
        options = options || {};

        if (options.destination) {
          options.destination.emit(SocketConstants.PUSH_GAMES, { games: options.games });
          console.log('PUSH GAMES');
        }
      },

      PUSH_PLAYER(options) {
        options = options || {};

        options.destination.emit(SocketConstants.PUSH_PLAYER, { player: options.player });
      }
    };
  }
}

module.exports = GameDataController;
