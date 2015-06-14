var CaptainAbilities = {
  Steal: function (move, game, callback) {
    // Only steal 2 or fewer coins. Don't take more than the player has.
    var coinsToSteal = Math.min(move.target.coins, 2);

    move.target.coins -= coinsToSteal;
    move.player.coins += coinsToSteal;
    if (callback) {
      callback();
    }
  }
};
module.exports = CaptainAbilities;
