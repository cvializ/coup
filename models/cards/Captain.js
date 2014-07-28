var Captain = {
  Steal: function (move) {
    move.target.coins -= 2;
    move.player.coins += 2;
  }
};
module.exports = Captain;
