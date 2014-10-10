"use strict";

var Orbit = (function() {
  // Constants
  var constants = {
    mu_earth: 398600, // km^3 s^-2
  };

  // Utility functions
  var utils = {};

  // norm a if a is a vector, otherwise return a
  utils.norm = function(a) {
    if (a.length !== undefined) {
      return math.norm(a);
    }
    return a;
  }

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
    mu = mu || constant.mu_earth;
    var one = math.e.div(math.cross(v, h), mu);
    var two = math.e.div(r, math.norm(r));
    return math.sub(one, two);
  };

  function Elliptic2D(parameters) {
    this.a = parameters.a;
    this.e = parameters.e;
    this.mu = parameters.mu;
  };

  Elliptic2D.prototype.recompute = function() {

  };

});
