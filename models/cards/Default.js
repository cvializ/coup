var DefaultAbilities = {
  Income: function (move, game, callback) {
    move.player.coins++;
    if (callback) callback();
  },
  'Foreign Aid': function (move, game, callback) {
    move.player.coins += 2;
    if (callback) callback();
  },
  Coup: function (move, game, callback) {
    move.target.chooseEliminatedCard(callback);
  }
};
module.exports = DefaultAbilities;
