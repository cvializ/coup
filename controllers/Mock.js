'use strict';

const BaseController = require('./Base');

class MockController extends BaseController {
  constructor(options) {
    super(options);

    options = options || {};
    this.options = options;
    this.constants = options.constants || {};
    this.expected = options.expected || {};
    this.events = options.events || {};
    this.initialize(options);
  }
}

module.exports = MockController;
