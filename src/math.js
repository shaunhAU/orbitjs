"use strict";

// Not very accurate math library.
// Okay for orbit.js
var math = (function() {
  function MathError(message) {
    this.message = message;
  }

  function ensure_dimension(a, b) {
    if (a.length !== b.length) {
      throw MathError("a.length != b.length");
    }
  }

  function cross(u, v) {
    if (u.length !== 3 || v.length !== 3) {
      throw MathError("can only cross vectors with 3 components");
    }

    return [
      u[1]*v[2] - u[2]*v[1],
      u[2]*v[0] - u[0]*v[2],
      u[0]*v[1] - u[1]*v[0]
    ];
  }

  function dot(a, b) {
    ensure_dimension(a, b);

    var s = 0;
    for (var i=0, l=a.length; i<l; i++) {
      s += a[i] * b[i];
    }
    return s;
  }

  function norm(a) {
    var s = 0;
    for (var i=0, l=a.length; i<l; i++) {
      s += (a[i]*a[i]);
    }
    return Math.sqrt(s);
  }

  function e_add(v, a) {
    var r = [];
    for (var i=0, l=v.length; i<l; i++) {
      r.push(v[i] + a);
    }
    return r;
  }

  function e_mul(v, a) {
    var r = [];
    for (var i=0, l=v.length; i<l; i++) {
      r.push(v[i] * a);
    }
    return r;
  }

  function e_div(v, a) {
    var r = [];
    for (var i=0, l=v.length; i<l; i++) {
      r.push(v[i] / a);
    }
    return r;
  }

  function add(a, b) {
    ensure_dimension(a, b);

    var c = [];
    for (var i=0, l=a.length; i<l; i++) {
      c.push(a[i] + b[i]);
    }
    return c
  }

  function sub(a, b) {
    ensure_dimension(a, b);

    var c = [];
    for (var i=0, l=a.length; i<l; i++) {
      c.push(a[i] - b[i]);
    }
    return c
  }

  function mul(a, b) {
    ensure_dimension(a, b);

    var c = [];
    for (var i=0, l=a.length; i<l; i++) {
      c.push(a[i] * b[i]);
    }
    return c
  }

  function div(a, b) {
    ensure_dimension(a, b);

    var c = [];
    for (var i=0, l=a.length; i<l; i++) {
      c.push(a[i] / b[i]);
    }
    return c
  }

  return {
    e: {
      add: e_add,
      mul: e_mul,
      div: e_div,
    },
    add: add,
    sub: sub,
    mul: mul,
    div: div,
    cross: cross,
    dot: dot,
    norm: norm,
    MathError: MathError,
  };
})();
