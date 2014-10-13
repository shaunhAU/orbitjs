"use strict";

(function() {
  describe("Elliptic2D", function() {
    var kso;
    var kso_d = 3468.75; //km
    var kerbin_radius = 600; //km

    var onetwohundred_orbit;

    beforeEach(function() {
      kso = new Orbit.Elliptic2D({
        a: kso_d,
        e: 0,
        mu: Orbit.constants.mu_kerbin,
        r: kerbin_radius,
      });

      onetwohundred_orbit = new Orbit.Elliptic2D({
        a: 750,
        e: (1/15),
        mu: Orbit.constants.mu_kerbin,
        r: kerbin_radius,
      });
    });

    it("should compute geosynchronous orbits", function() {
      // kerbin geosynchronous orbit!
      expect(kso.b).toEqual(kso_d);
      expect(kso.p).toEqual(kso_d);
      expect(kso.c).toEqual(0);
      expect(kso.r_p).toEqual(kso_d);
      expect(kso.r_a).toEqual(kso_d);
      expect(kso.apoapsis_altitude).toEqual(2868.75);
      expect(kso.periapsis_altitude).toEqual(2868.75);

      expect(kso.period).toBeCloseTo(21600, 1);
      expect(kso.n).toBeCloseTo(2.9089e-4, 0.1e-4);
      expect(kso.specific_energy).toBeCloseTo(-0.50906, 0.00001);
    });

    it("should compute orbit with 100 km and 200 km altitude from Kerbin", function() {
      expect(onetwohundred_orbit.c).toBe(50);
      expect(onetwohundred_orbit.p).toBeCloseTo(746.6666, 0.0001);
      expect(onetwohundred_orbit.r_p).toBe(700);
      expect(onetwohundred_orbit.r_a).toBe(800);
      expect(onetwohundred_orbit.b).toBeCloseTo(748.33, 0.01);
      expect(onetwohundred_orbit.periapsis_altitude).toEqual(100);
      expect(onetwohundred_orbit.apoapsis_altitude).toEqual(200);
    });

    it("should compute velocity and r", function() {
      var rv = kso.rv_at_theta(0);
      expect(rv.r).toEqual(kso_d);
      expect(rv.altitude.r).toEqual(kso_d - kerbin_radius);
      expect(rv.v).toBeCloseTo(1.00902, 0.00001);

      rv = onetwohundred_orbit.rv_at_theta(0);
      expect(rv.r).toEqual(700);
      expect(rv.altitude.r).toEqual(100);
      expect(rv.v).toBeCloseTo(2.319, 0.001);

      rv = onetwohundred_orbit.rv_at_theta(Math.PI);
      expect(rv.r).toEqual(800);
      expect(rv.altitude.r).toEqual(200);
      expect(rv.v).toBeCloseTo(2.030, 0.001);
    });

    it("should compute time since periapsis", function() {
      var time = kso.time_since_periapsis(0);
      expect(time).toBe(0);

      time = kso.time_since_periapsis(Math.PI);
      expect(time).toBeCloseTo(3 * 3600, 0.1);
    });
  });
})();
