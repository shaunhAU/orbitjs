"use strict";

var Canvas = (function() {
  function Canvas(id, info_div_id, styles) {
    this.viewport = document.getElementById(id);
    this.background_el = this.viewport.querySelectorAll(".background")[0];
    this.foreground_el = this.viewport.querySelectorAll(".foreground")[0];
    this.background_ctx = this.background_el.getContext("2d");
    this.foreground_ctx = this.foreground_el.getContext("2d");
    this.info_el = document.getElementById(info_div_id);
    this.frt_el = this.info_el.querySelectorAll(".frt"); // frame render time
    if (this.frt_el.length >= 0) {
      this.frt_el = this.frt_el[0];
    }

    this.styles = styles || {};
    this.styles.center = this.styles.center || {color: "#000"};
    this.styles.m1 = this.styles.m1 || {color: "#CCC", fill: "#1C6BA0"};
    this.styles.m2 = this.styles.m2 || {color: "#00F", fill: null};
    this.styles.orbit = this.styles.orbit || {color: "#000"};

    this.orbit = null;
    this.orbit_type = null;
    this.current_time = 0;

    this.orbital_period_real_time = 20; // 20 seconds per period
  }

  Canvas.prototype._clear = function(ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.background_el.width, this.background_el.height);
    ctx.restore();
  };

  Canvas.prototype.clear_background = function() {
    this._clear(this.background_ctx);
  };

  Canvas.prototype.clear_foreground = function() {
    this._clear(this.foreground_ctx);
  };

  Canvas.prototype.set_orbit = function(orbit) {
    this.orbit = orbit;

    this.clear_background();
    this.clear_background();
    if (this.timer_id) {
      window.clearInterval(this.timer_id);
    }

    this.orbit.init_canvas(this);
    this.redraw();

    var start_time = new Date().getTime();
    var self = this;
    this.timer_id = window.setInterval(function() {
      var render_start = new Date().getTime();
      self.clear_foreground();
      self.current_time = (new Date().getTime() - start_time) / 1000.0;
      self.redraw();
      if (self.frt_el) {
        self.frt_el.innerHTML = new Date().getTime() - render_start;
      }
    }, 33);
  };

  Canvas.prototype.redraw = function() {
    this.orbit.draw_on(this, this.current_time);
  };

  var KAPPA = 0.5522848;
  Canvas.prototype.ink = function(ctx, style) {
    if (style.fill) {
      ctx.fillStyle = style.fill;
      ctx.fill();
    } else if (style.color) {
      ctx.strokeStyle = style.color;
      ctx.stroke();
    } else {
      ctx.stroke();
    }
  };

  Canvas.prototype.draw_ellipse = function(ctx, x, y, a, b, style) {
    style = style || {};
    var ox = a * KAPPA,
        oy = b * KAPPA,
        xs = x - a,
        ys = y - b,
        xe = xs + 2 * a,
        ye = ys + 2 * b,
        xm = xs + a,
        ym = ys + b;

    ctx.beginPath();
    ctx.moveTo(xs, ym);
    ctx.bezierCurveTo(xs, ym - oy, xm - ox, ys, xm, ys);
    ctx.bezierCurveTo(xm + ox, ys, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, xs, ym + oy, xs, ym);
    this.ink(ctx, style);
  };

  Canvas.prototype.draw_circle = function(ctx, x, y, r, style) {
    style = style || {};
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    this.ink(ctx, style);
  };

  Canvas.prototype.draw_arrow = function(ctx, tailx, taily, headx, heady, style) {
    ctx.beginPath();
    ctx.moveTo(tailx, taily);
    ctx.lineTo(headx, heady);

    var theta = Math.atan2((heady - taily), (headx - tailx));
    var length = Math.sqrt(Math.pow(heady - taily, 2) + Math.pow(headx - tailx, 2));
    var rotated_x = length - style.size * Math.cos(style.angle);
    var rotated_y = style.size * Math.sin(style.angle);

    var ccw_side = math.rotate([rotated_x, rotated_y], theta);
    var cw_side = math.rotate([rotated_x, -rotated_y], theta);

    ctx.lineTo(ccw_side[0] + tailx, ccw_side[1] + taily);
    ctx.lineTo(cw_side[0] + tailx, cw_side[1] + taily);
    ctx.lineTo(headx, heady);
    this.ink(ctx, style);
  };

  return Canvas;
})();
