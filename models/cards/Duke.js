var Duke = {
  Treasury: function (move, game, callback) {
    move.player.coins += 3;
    if (callback) callback();
  }
};
module.exports = Duke;
