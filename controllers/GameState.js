'use strict';

const BaseController = require('./Base'),
      ServerConstants = require('../app/js/constants/server');

class GameStateController extends BaseController {
  constructor(options) {
    super(options);
  }

  get constants() {
    return ServerConstants;
  }

  get events() {
    return {
      GAME_OVER: 'default',
      MY_TURN: 'default',
      NEW_TURN: 'default'
    };
  }
}

module.exports = GameStateController;
