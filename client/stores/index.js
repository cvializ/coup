var LandingStore = require('./Landing');
var PlayStore = require('./Play');

module.exports = {
  LandingStore: new LandingStore(),
  PlayStore: new PlayStore()
};
