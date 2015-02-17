"use strict";

Orbits.Elliptic2D = (function(Orbits) {
  function Elliptic2D(parameters) {
    this.a = parameters.a;
    this.e = parameters.e;
    this.mu = parameters.mu || Orbits.constants.mu_kerbin;
    this.body_radius = parameters.r;

    this.show_r_vector = parameters.show_r_vector || false;
    this.show_v_vector = parameters.show_v_vector || false;
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

    // Other things for drawing things

    // for drawing a velocity vector.
    this.v_p = this.rv_at_theta(0).v;
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

  Elliptic2D.prototype.canvas_length_scale = function(v) {
    return v * this.usable_canvas_width / (2 * this.a);
  };


  Elliptic2D.prototype.canvas_velocity_scale = function(v) {
    // maximum velocity will be 10% of the canvas width
    var PERCENTAGE_OF_USEFUL_WIDTH = 0.5;
    return v * PERCENTAGE_OF_USEFUL_WIDTH * this.usable_canvas_width / (2 * this.v_p);
  };

  /**
   * Calculate the coorindate for <canvas> given a coordinate in the perifocal
   * reference frame. This needs a canvas to be initialized and uses a 5%
   * padding on either side.
   * @param  number x x coordinate in the perifocal reference frame.
   * @param  number y y coordinate in the perifocal reference frame
   * @return hash {x: x in canvas, y: y in canvas}
   */
  Elliptic2D.prototype.scale_length_to_canvas = function(x, y) {
    var margin = (this.canvas_width - this.usable_canvas_width) / 2;
    x = this.canvas_length_scale(this.r_a + x);
    y = this.canvas_length_scale(y);
    return {
      x: margin + x,
      y: this.canvas_height / 2 - y
    };
  };

  /**
   * Calculate the size of a velocity vector for <canvas>
   * @param  number x x velocity
   * @param  number y y velocity
   * @return hash   {x: x velocity scaled for <canvas>, y: y for the same}
   */
  Elliptic2D.prototype.scale_velocity_to_canvas = function(x, y) {
    var margin = (this.canvas_width - this.usable_canvas_width) / 2;
    return {
      x: this.canvas_velocity_scale(x),
      y: -this.canvas_velocity_scale(y)
    };
  };

  var CENTER_SIZE = 10;
  Elliptic2D.prototype.draw_background = function(canvas) {
    var ctx = canvas.background_ctx;

    var center = this.scale_length_to_canvas(0, 0);
    var center_offset = CENTER_SIZE / 2;

    // Draw center body
    canvas.draw_circle(ctx, center.x, center.y, this.canvas_length_scale(this.body_radius), canvas.styles.m1);

    // Draw middle cross
    ctx.beginPath();
    ctx.moveTo(center.x - center_offset, center.y);
    ctx.lineTo(center.x + center_offset, center.y);

    ctx.moveTo(center.x, center.y - center_offset);
    ctx.lineTo(center.x, center.y + center_offset);

    ctx.strokeStyle = canvas.styles.center.color;
    ctx.stroke();

    // Draw orbit
    canvas.draw_ellipse(ctx, this.canvas_width / 2, this.canvas_height / 2, this.canvas_length_scale(this.a), this.canvas_length_scale(this.b), canvas.styles.orbit);
  };

  Elliptic2D.prototype.update_info = function(canvas, time, rv, theta) {
    if (!canvas.info_el) {
      return;
    }

    var display = function(selector, value) {
      var el = canvas.info_el.querySelectorAll(selector);
      if (el.length > 0) {
        el[0].innerHTML = math.round(value, 2);
      }
    };

    display(".apoapsis", this.r_a);
    display(".periapsis", this.r_p);
    display(".semimajor", this.a);
    display(".eccentricity", this.e);
    display(".time", time);
    display(".altitude", rv.altitude);
    display(".velocity", rv.v);
    display(".theta", theta * 180 / Math.PI);
  };

  Elliptic2D.prototype.draw_satellite = function(canvas, location, velocity) {
    var satellite_screen_size = 8;
    var r_arrow_style = {
      size: 20,
      angle: 20 * Math.PI / 180,
      color: "#F00"
    };
    var v_arrow_style = {
      size: 20,
      angle: 20 * Math.PI / 180,
      color: "#F0F"
    };
    var center = this.scale_length_to_canvas(0, 0);

    location = this.scale_length_to_canvas(location.x, location.y);
    canvas.draw_circle(
      canvas.foreground_ctx,
      location.x,
      location.y,
      satellite_screen_size,
      canvas.styles.m2
    );

    if (this.show_r_vector) {
      canvas.draw_arrow(
        canvas.foreground_ctx,
        center.x,
        center.y,
        location.x,
        location.y,
        r_arrow_style
      );
    }

    if (this.show_v_vector) {
      velocity = this.scale_velocity_to_canvas(velocity.x, velocity.y);
      canvas.draw_arrow(
        canvas.foreground_ctx,
        location.x,
        location.y,
        location.x + velocity.x,
        location.y + velocity.y,
        v_arrow_style
      );
    }
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
    this.canvas_width = canvas.background_el.width;
    this.canvas_height = canvas.background_el.height;
    this.usable_canvas_width = canvas.background_el.width * 0.9;
    this.draw_background(canvas);
  };

  Elliptic2D.prototype.init_canvas = function(canvas) {
    this.resize_canvas(canvas);
    var theta = this.theta_given_time(0); // sloooooowwwww
    var rv = this.rv_at_theta(theta);
    this.update_info(canvas, 0, rv, theta);
  };

  Elliptic2D.prototype.draw_on = function(canvas, time, params) {
    time = this.period * time / canvas.orbital_period_real_time;
    time = time % this.period;
    var theta = this.theta_given_time(time); // sloooooowwwww
    var rv = this.rv_at_theta(theta);

    this.draw_satellite(
      canvas,
      {x: rv.perifocal.rx, y: rv.perifocal.ry},
      {x: rv.perifocal.vx, y: rv.perifocal.vy}
    );

    this.update_info(canvas, time, rv, theta);
  };

  return Elliptic2D;
})(Orbits);
