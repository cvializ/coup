var Captain = {
  Steal: function (move, game, callback) {
    move.target.coins -= 2;
    move.player.coins += 2;
    if (callback) callback();
  }
};
module.exports = Captain;
