'use strict';

class GameCollection {
  gameExists(value, property) {
    property = property || 'title';

    for (let key in this) {
      if(this[key][property] === value) {
        return true;
      }
    }
    return false;
  }

  getClientObject() {
    return Object.keys(this).map((key) => this[key].getClientObject());
  }
}

module.exports = GameCollection;
