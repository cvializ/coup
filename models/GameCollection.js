function GameCollection() { }

function exists(value, property) {
  property = property || 'title';

  for (var key in this) {
    if(this[key][property] === value) {
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
  for (var key in this) {
    gameList.push(this[key].getClientObject());
  }

  return gameList;
}
Object.defineProperty(GameCollection.prototype, 'getClientObject', {
  value: getClientObject,
  enumerable: false
});

module.exports = GameCollection;
