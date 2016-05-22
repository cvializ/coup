'use strict';

const BaseController = require('./Base'),
      ServerConstants = require('../app/js/constants/server');

class PlayerController extends BaseController {

  get constants() {
    return ServerConstants;
  }

  get events() {
    return {
      SELECT_OWN_INFLUENCE: 'default'
    };
  }
}

module.exports = PlayerController;
