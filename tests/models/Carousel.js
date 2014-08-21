var expect = require('chai').expect,
    Carousel = require('../../models/Carousel');

describe('Carousel', function () {
  var carousel,
      collection = {
        'Player1': { coins: 1, order: 3 },
        'Ralph': { coins: 2, order: 2 },
        'Frank': { coins: 3, order: 1 }
      };

  beforeEach(function (done) {
    carousel = new Carousel(collection);
    done();
  });

  describe('#constructor', function () {
    it('should create a list of items from the given collection', function () {
      expect(carousel.list).to.deep.equal([
          { coins: 3, order: 1 },
          { coins: 2, order: 2 },
          { coins: 1, order: 3 }
      ]);
    });

    it('should sort the objects in the collection by their order property', function () {
      var expectedUser = 'Frank';
      expect(carousel.next()).to.equal(collection[expectedUser]);
    });

    it('should accept objects without an order property', function () {
      carousel = new Carousel({
        'A': { p: 1 },
        'B': { p: 2 },
        'C': { p: 3 }
      });
      expect(carousel.list.length).to.equal(3);
    });
  });

  describe('#next', function () {
    it('should return null if the list is empty', function () {
      carousel = new Carousel({});
      expect(carousel.next()).to.equal(null);
    });

    it('should return the first item in the collection on the first call', function () {
      expect(carousel.next()).to.equal(carousel.list[0]);
    });

    it('should return the first item on the (list.length + 1)th call', function () {
      var first,
          nth,
          length = carousel.list.length,
          i;

      first = carousel.peek();

      // make
      for (i = 0; i < length + 1; i++) {
        nth = carousel.next();
      }

      expect(first).to.equal(nth);
    });
  });

  describe('#peek', function () {
    it('should return null if the list is empty', function () {
      carousel = new Carousel({});
      expect(carousel.peek()).to.equal(null);
    });

    it('should return the first item on the first call', function () {
      expect(carousel.peek()).to.equal(carousel.list[0]);
    });

    it('should not advance the index', function () {
      var peeked;

      // check for the first
      expect(carousel.index).to.equal(-1);
      peeked = carousel.peek();
      expect(carousel.peek()).to.equal(peeked);
      expect(carousel.index).to.equal(-1);
    });

    it('should return the same object as the call to next', function () {
      var peeked = carousel.peek(),
          next = carousel.next();

      expect(next).to.equal(peeked);
    });
  });

  describe('#getNextIndex', function () {
    it('should return 0 on the first call', function () {
      expect(carousel.getNextIndex()).to.equal(0);
    });

    it('should return 0 after (list.length) calls to #next', function () {
      var length = carousel.list.length,
          i;

      for (i = 0; i < length; i++) {
        carousel.next();
      }
      expect(carousel.index).to.equal(carousel.list.length - 1);
      expect(carousel.getNextIndex()).to.equal(0);
    });
  });
});
