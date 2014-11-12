"use strict";

Orbits.Elliptic2D = (function(Orbits) {
  function Elliptic2D(parameters) {
    this.a = parameters.a;
    this.e = parameters.e;
    this.mu = parameters.mu || Orbits.constants.mu_kerbin;
    this.body_radius = parameters.r;
    this.recompute();
  }

  /**
   * Recomputes the basic elements of this orbit.
   */
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

  /**
   * Computes the radius and velocity with its magnitude as well as its
   * components in the perifocal reference type.
   * @param  number theta true anomaly measured in radians
   */
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

  /**
   * Given a time since periapsis, calculate the true anomaly
   * @param  number t time in seconds
   * @return number true anomaly in radians
   */
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

  Elliptic2D.prototype.canvas_scale = function(v) {
    return v * this.usable_canvas_width / (2 * this.a);
  };

  /**
   * Calculate the coorindate for <canvas> given a coordinate in the perifocal
   * reference frame. This needs a canvas to be initialized and uses a 5%
   * padding on either side.
   * @param  number x x coordinate in the perifocal reference frame.
   * @param  number y y coordinate in the perifocal reference frame
   * @return hash {x: x in canvas, y: y in canvas}
   */
  Elliptic2D.prototype.to_canvas_coordinates = function(x, y) {
    var margin = (this.canvas_width - this.usable_canvas_width) / 2;
    x = this.canvas_scale(this.r_a + x);
    y = this.canvas_scale(y);
    return {
      x: margin + x,
      y: this.canvas_height / 2 - y
    };
  };

  var CENTER_SIZE = 10;
  Elliptic2D.prototype.draw_background = function(canvas) {
    var ctx = canvas.ctx;

    // Draws the center
    var center = this.to_canvas_coordinates(0, 0);
    var center_offset = CENTER_SIZE / 2;
    ctx.beginPath();
    ctx.moveTo(center.x - center_offset, center.y);
    ctx.lineTo(center.x + center_offset, center.y);

    ctx.moveTo(center.x, center.y - center_offset);
    ctx.lineTo(center.x, center.y + center_offset);

    ctx.strokeStyle = canvas.styles.center.color;
    ctx.stroke();

    canvas.draw_ellipse(this.canvas_width / 2, this.canvas_height / 2, this.canvas_scale(this.a), this.canvas_scale(this.b), canvas.styles.orbit);
  };

  Elliptic2D.prototype.resize_canvas = function(canvas) {
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
    this.canvas_width = canvas.el.width;
    this.canvas_height = canvas.el.height;
    this.usable_canvas_width = canvas.el.width * 0.9;
    this.draw_background(canvas);
  };

  Elliptic2D.prototype.init_canvas = function(canvas) {
    this.resize_canvas(canvas);
  };

  Elliptic2D.prototype.draw_on = function(canvas, params) {

  };

  return Elliptic2D;
})(Orbits);
