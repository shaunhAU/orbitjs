"use strict";

var Canvas = (function() {
  function Canvas(id, info_div_id, styles) {
    this.el = document.getElementById(id);
    this.ctx = this.el.getContext("2d");

    this.styles = styles || {};
    this.styles.center = this.styles.center || {color: "#000"};
    this.styles.m1 = this.styles.m1 || {color: "#CCC", fill: "#CCC"};
    this.styles.m2 = this.styles.m2 || {color: "#00F", fill: null};
    this.styles.orbit = this.styles.orbit || {color: "#000"};

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

  var KAPPA = 0.5522848;
  Canvas.prototype.ink = function(style) {
    if (style.fill) {
      this.ctx.fillStyle = style.fill;
      this.ctx.fill();
    } else if (style.color) {
      this.ctx.strokeStyle = style.color;
      this.ctx.stroke();
    } else {
      this.ctx.stroke();
    }
  };

  Canvas.prototype.draw_ellipse = function(x, y, a, b, style) {
    style = style || {};
    var ox = a * KAPPA,
        oy = b * KAPPA,
        xs = x - a,
        ys = y - b,
        xe = xs + 2 * a,
        ye = ys + 2 * b,
        xm = xs + a,
        ym = ys + a,
        ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(xs, ym);
    ctx.bezierCurveTo(xs, ym - oy, xm - ox, ys, xm, ys);
    ctx.bezierCurveTo(xm + ox, ys, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, xs, ym + oy, xs, ym);
    this.ink(style);
  };

  Canvas.prototype.draw_circle = function(x, y, r, style) {
    style = style || {};
    var ctx = this.ctx;
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    this.ink(style);
  };

  return Canvas;
})();
