"use strict";

Things.CelestrialObject = (function() {
  function CelestrialObject(params) {
    this.orbit = params.orbit;
    this.canvas = params.canvas;
    this.satellites = params.satellites || [];
    this.orbiting_body = params.orbiting_body || null;

    this.radius = params.radius;
    this.mu = params.mu || 0;
    this.mass = params.mass || 0;
    if (this.mass) {
      this.mu = Orbits.constants.G * this.mass;
    } else if (this.mu) {
      this.mass = this.mu / Orbits.constants.G;
    } else {
      throw "cannot initialize CelestrialObject without either a mass or a mu";
    }
  }

  CelestrialObject.prototype.add_satellite = function(satellite) {
    this.satellite.push(satellite);
    satellite.orbiting_body = this;
    satellite.redraw();
  };

  CelestrialObject.prototype.redraw = function() {
  };

  return CelestrialObject;
})();
