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

var games = new GameCollection();

module.exports = games;

