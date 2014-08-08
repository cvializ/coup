function GameCollection() { }

function exists(title) {
  for (var key in this) {
    if(this[key].title === title) {
      return true;
    }
  }
  return false;
}
Object.defineProperty(GameCollection.prototype, 'gameExists', {
  value: exists,
  enumerable: false
});

function getClientObject() {
  var gameList = [];
  for (var key in games) {
    gameList.push(games[key].getClientObject());
  }

  return gameList;
}
Object.defineProperty(GameCollection.prototype, 'getClientObject', {
  value: getClientObject,
  enumerable: false
});

var games = new GameCollection();

module.exports = games;
