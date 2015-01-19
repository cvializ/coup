var GameCollection = require('./models/GameCollection'),
    games = new GameCollection();

// Use as a singleton collection object.
module.exports = games;
