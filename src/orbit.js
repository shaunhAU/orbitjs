"use strict";

// As a warning, since we just use JS math, this is very not exact.
// Not very good to use for scientific computing. Maybe okay for games,
// designed for demos.
/*jshint -W079 */
var Orbit = (function() {
  // Constants
  var constants = {
    mu_earth: 398600,  // km^3 s^-2
    mu_kerbin: 3531.6, // km^3 s^-2
  };

  // Utility functions
  var utils = {};

  // norm a if a is a vector, otherwise return a
  utils.norm = function(a) {
    if (a.length !== undefined) {
      return math.norm(a);
    }
    return a;
  };

  // Fundamental integrals
  utils.angular_momentum = function(r, v) {
    return math.cross(r, v);
  };

  utils.orbital_specific_energy = function(v, r, mu) {
    v = utils.norm(v);
    r = utils.norm(r);
    mu = mu || constants.mu_earth;

    return v * v / 2 - mu / r;
  };

  utils.eccentricity_vector = function(v, h, r, mu) {
    mu = mu || constants.mu_earth;
    var one = math.e.div(math.cross(v, h), mu);
    var two = math.e.div(r, math.norm(r));
    return math.sub(one, two);
  };

  function Elliptic2D(parameters) {
    this.a = parameters.a;
    this.e = parameters.e;
    this.mu = parameters.mu || constants.mu_kerbin;
    this.body_radius = parameters.r;
    this.recompute();
  }

  Elliptic2D.prototype.recompute = function() {
    // Basic elliptical parameters
    this.b = this.a * Math.sqrt(1 - this.e * this.e);
    this.p = this.a * (1 - this.e * this.e);
    this.c = this.a * this.e;
    this.r_p = this.a * (1 - this.e);
    this.r_a = this.a * (1 + this.e);

    // Orbital parameters
    this.n = Math.sqrt(this.mu / Math.pow(this.a, 3));
    this.period = Math.sqrt(4 * Math.pow(Math.PI, 2) * Math.pow(this.a, 3) / this.mu);
    this.specific_energy = -this.mu / (2 * this.a);

    this.periapsis_altitude = this.r_p - this.body_radius;
    this.apoapsis_altitude = this.r_a - this.body_radius;
  };

  Elliptic2D.prototype.rv_at_theta = function(theta) {
    var r = this.p / (1 + this.e * Math.cos(theta));
    var v = Math.sqrt(this.mu * (2 / r - 1 / this.a));
    return {
      r: r,
      v: v,
      altitude: {
        r: r - this.body_radius
      }
    };
  };

  Elliptic2D.prototype.E = function(theta) {
    return 2 * Math.atan(Math.sqrt(1 - this.e) / Math.sqrt(1 + this.e) * Math.tan(theta / 2));
  };

  Elliptic2D.prototype.time_since_periapsis = function(theta) {
    var E = this.E(theta);
    return (E - this.e * Math.sin(E)) / this.n;
  };

  return {
    constants: constants,
    utils: utils,
    Elliptic2D: Elliptic2D,
  };
})();
