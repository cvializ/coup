var AssassinAbilities = {
  Assassinate: function (move, game, callback) {
    move.target.chooseEliminatedCard(callback);
  }
};
module.exports = AssassinAbilities;
