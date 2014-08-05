var Ambassador = {
  "Exchange Influence": function (move, game) {
    var player = move.player,
        activeInfluence = player.influences.filter(function (influence) { return !influence.eliminated });

    game.deck.putOnTopOfDeck(activeInfluence);
    game.deck.shuffle();

    player.influences = player.influences.map(function (influence) {
      if (influence.eliminated) {
        return influence;
      } else {
        return game.deck.drawRandom();
      }
    });
  }
};
module.exports = Ambassador;
