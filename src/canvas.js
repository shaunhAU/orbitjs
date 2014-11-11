"use strict";

(function() {
  function Canvas(id) {
    this.el = document.getElementById(id);
    this.ctx = this.el.getContext("2d");

    this.orbit = null;
    this.orbit_type = null;
    this.current_time = 0;
    this.time_step = 0;
  }

  Canvas.prototype.set_orbit = function(orbit) {
    this.orbit = orbit;
    this.orbit.init_canvas(this);
    this.redraw();
  };

  Canvas.prototype.redraw = function() {
    this.orbit.draw_on(this);
  };
})();
