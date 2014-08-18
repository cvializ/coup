function Carousel(collection) {
  this.list = [];
  // The index of the most recently returned item
  this.index = -1;

  for (var key in collection) {
    if (collection.hasOwnProperty(key)) {
      this.list.push(collection[key]);
    }
  }
}

Carousel.prototype.next = function () {
  var nextItem;

  if (this.list.length === 0) {
    return null;
  }

  this.index = this.getNextIndex();

  nextItem = this.list[this.index];

  return nextItem;
};

Carousel.prototype.getNextIndex = function () {
  return (this.index === this.list.length - 1 ? 0 : this.index + 1);
};

Carousel.prototype.peek = function () {
  if (this.list.length > 0) {
    return this.list[this.getNextIndex()];
  } else {
    return null;
  }
};

module.exports = Carousel;
