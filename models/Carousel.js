'use strict';

class Carousel {
  constructor(collection) {
    this.list = [];
    // The index of the most recently returned item
    this.index = -1;

    for (let key in collection) {
      if (collection.hasOwnProperty(key)) {
        this.list.push(collection[key]);
      }
    }

    // This uses an optional 'order' property
    // to allow items to be sorted
    // i.e. players who join a game first can go first.
    this.list.sort(function (a, b) {
      return a.order - b.order;
    });
  }

  remove(element) {
    const list = this.list,
          elementIndex = list.indexOf(element);

    if (~elementIndex) {
      list.splice(elementIndex, 1);

      if (this.index === elementIndex) {
        this.index = this.getNextIndex();
      }
    }
  }

  next() {
    if (this.list.length === 0) {
      return null;
    }

    this.index = this.getNextIndex();

    let nextItem = this.list[this.index];

    return nextItem;
  }

  getNextIndex() {
    return (this.index === this.list.length - 1 ? 0 : this.index + 1);
  }

  peek() {
    if (this.list.length > 0) {
      return this.list[this.getNextIndex()];
    } else {
      return null;
    }
  }
}

module.exports = Carousel;
