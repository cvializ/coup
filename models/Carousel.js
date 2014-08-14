function Carousel(collection) {
  this.list = [];
  this.index = 0;

  for (var key in collection) {
    if (collection.hasOwnProperty(key)) {
      this.list.push(collection[key]);
    }
  }
}

Carousel.prototype.next = function () {
  var len = this.list.length;

  if (len === 0) {
    return null;
  }

  this.index = this.getNextIndex();

  return this.list[this.index];
};

Carousel.prototype.getNextIndex = function () {
  return (this.index === this.list.length - 1 ? 0 : this.index + 1);
};

Carousel.prototype.peek = function () {
  return this.list[this.getNextIndex()];
};

module.exports = Carousel;
