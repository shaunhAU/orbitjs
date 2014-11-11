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
      altitude: r - this.body_radius,
      perifocal: {
        rx: r * Math.cos(theta),
        ry: r * Math.sin(theta),
        vx: -Math.sqrt(this.mu / this.p) * Math.sin(theta),
        vy: Math.sqrt(this.mu / this.p) * (this.e + Math.cos(theta))
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

  Elliptic2D.prototype.theta_given_time = function(t) {
    var M = this.n * t;
    var E_current = M;
    var E_next;
    var i = 0;
    while (true) {
      E_next = E_current + (M - E_current + this.e * Math.sin(E_current)) / (1 - this.e * Math.cos(E_current));
      if (Math.abs(E_next - E_current) < 0.00001) {
        break;
      }
      E_current = E_next;
      i++;
    }

    var theta = 2 * Math.atan(Math.sqrt((1 + this.e) / (1 - this.e)) * Math.tan(E_next / 2));
    while (theta < 0) {
      theta += Math.PI * 2;
    }
    return theta % (Math.PI * 2);
  };

  Elliptic2D.prototype.trace = function(theta_increments) {
    theta_increments = theta_increments || 0.0087266; // increment by 0.5 degrees
    var orbit = [];
    var rv, t;
    for (var current_theta = 0; current_theta < Math.PI * 2; current_theta += theta_increments) {
      rv = this.rv_at_theta(current_theta);
      t = this.time_since_periapsis(current_theta);
      orbit.push({
        rv: rv,
        altitude: rv.altitude,
        t: t
      });
    }
    return orbit;
  };

  Elliptic2D.prototype.resize_canvas = function(canvas) {
    this.usable_canvas_width = canvas.el.width;
  };

  Elliptic2D.prototype.init_canvas = function(canvas) {
    // Regardless of what happens, we need to first compute the geometry we
    // can use.
    //
    // For now, we will only plot the periapsis on the right side and the orbit
    // horizontally (semimajor axis horizontally)
    //
    // We also assume that the canvaa is at least 400px. We want to leave about
    // 5% of the edge each side, leaving us with some room to draw things if
    // necessary. This is a minimum of 20pxs each side according to our minimum
    // specification.
    this.resize_canvas(canvas);
  };

  Elliptic2D.prototype.draw_on = function(canvas, params) {

  };

  return {
    constants: constants,
    utils: utils,
    Elliptic2D: Elliptic2D,
  };
})();
