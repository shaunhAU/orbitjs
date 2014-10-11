"use strict";

(function() {
  describe("Elliptic2D", function() {
    var kso;
    var kso_d = 3468.75; //km
    beforeEach(function() {
      kso = new Orbit.Elliptic2D({
        a: kso_d,
        e: 0,
        mu: Orbit.constants.mu_kerbin,
      });
      kso.recompute();
    });

    it("should compute geosynchronous orbits", function() {
      // kerbin geosynchronous orbit!
      expect(kso.b).toEqual(kso_d);
      expect(kso.p).toEqual(kso_d);
      expect(kso.c).toEqual(0);
      expect(kso.r_p).toEqual(kso_d);
      expect(kso.r_a).toEqual(kso_d);

      expect(kso.period).toBeCloseTo(21600, 1);
      expect(kso.n).toBeCloseTo(2.9089e-4, 0.1e-4);
      expect(kso.specific_energy).toBeCloseTo(-0.50906, 0.00001);
    });

    it("should compute velocity and r", function() {
      var rv = kso.rv_at_theta(0);
      expect(rv.r).toEqual(kso_d);
      expect(rv.v).toBeCloseTo(1.00902, 0.00001);
    });
  });
})();
