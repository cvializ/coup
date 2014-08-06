var Assassin = {
  Assassinate: function (move, game, callback) {
    move.player.coins -= 3;
    move.target.chooseEliminatedCard(callback);
  }
};
module.exports = Assassin;
