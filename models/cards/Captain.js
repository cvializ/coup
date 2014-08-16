var CaptainAbilities = {
  Steal: function (move, game, callback) {
    var target = move.target,
        coinsToSteal = 2;

    // Only steal 2 or fewer coins. Don't take more than the player has.
    coinsToSteal = (target.coins >= coinsToSteal ? coinsToSteal : target.coins );

    move.target.coins -= coinsToSteal;
    move.player.coins += coinsToSteal;
    if (callback) {
      callback();
    }
  }
};
module.exports = CaptainAbilities;
