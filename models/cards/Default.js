var Default = {
  Income: function (move) {
    move.player.coins++;
  },
  'Foreign Aid': function (move) {
    move.player.coins += 2;
  },
  Coup: function (move) {
    console.log('COUP');
  }
};
module.exports = Default;
