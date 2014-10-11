"use strict";

(function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toBeCloseTo: function() {
        return {
          compare: function(actual, expected, significance) {
            significance = significance || 1e-5;
            return {
              pass: Math.abs(actual - expected) <= significance
            };
          }
        };
      }
    });
  });

  describe("math", function() {
    it("should cross vectors", function() {
      expect(math.cross([1, 7, 13], [4, 5, 19])).toEqual([68, 33, -23]);
      expect(math.cross([0, 0, 0], [0, 0, 0])).toEqual([0, 0, 0]);
      expect(math.cross([-5.4, -1.2, 19.3], [-1, 10, -200])).toEqual([47, -1099.3, -55.2]);
    });

    it("should dot vectors", function() {
      expect(math.dot([1, 2, 3], [2, 3, 4])).toBe(20);
      expect(math.dot([1.2, -4.3, 19.1], [20, -10, 10.3])).toBe(263.73);
    });

    it("should not dot vectors without the same dimension", function() {
      expect(function() { math.dot([1, 2, 3], [1, 1]); }).toThrow(math.DimensionMismatchError);
    });

    it("should norm vectors", function() {
      expect(math.norm([1, 3, -10])).toBeCloseTo(10.488, 0.001);
    });

    it("should perform element wise operation", function() {
      expect(math.e.add([1, 2], 1)).toEqual([2, 3]);
      expect(math.e.add(1, [1, 2])).toEqual([2, 3]);
      expect(math.e.add([1, 2], [3, 4])).toEqual([4, 6]);
      expect(math.e.add(1, 2)).toEqual(3);

      expect(math.e.sub([1, 2], 1)).toEqual([0, 1]);
      expect(math.e.sub(1, [1, 2])).toEqual([0, -1]);
      expect(math.e.sub([1, 4], [2, 3])).toEqual([-1, 1]);
      expect(math.e.sub(1, 2)).toEqual(-1);

      expect(math.e.mul([3, 4], 3)).toEqual([9, 12]);
      expect(math.e.mul(3, [3, 4])).toEqual([9, 12]);
      expect(math.e.mul([4, 5], [2, 3])).toEqual(([8, 15]));
      expect(math.e.mul(3, 9)).toEqual(27);

      expect(math.e.div([25, 5], 5)).toEqual([5, 1]);
      expect(math.e.div([30, 12], 5)).toEqual([6, 2.4]);
      expect(math.e.div(5, [2, 5])).toEqual([2.5, 1]);
      expect(math.e.div(5, 5)).toEqual(1);
    });
  });
})();