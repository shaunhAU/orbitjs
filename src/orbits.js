"use strict";

// As a warning, since we just use JS math, this is very not exact.
// Not very good to use for scientific computing. Maybe okay for games,
// designed for demos.
/*jshint -W079 */
var Orbits = (function() {
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

  return {
    constants: constants,
    utils: utils
  };
})();
