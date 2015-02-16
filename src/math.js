"use strict";

// Not very accurate math library.
// Okay for orbit.js
/*jshint -W079 */
var math = (function() {
  function MathError(message) {
    this.message = message;
  }

  var DimensionMismatchError = new MathError("a.length != b.length");

  function ensure_dimension(a, b) {
    if (a.length !== b.length) {
      throw DimensionMismatchError;
    }
  }

  function cross(u, v) {
    if (u.length !== 3 || v.length !== 3) {
      throw new MathError("can only cross vectors with 3 components");
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

  function rotate(v, theta) {
    var xp = v[0] * Math.cos(theta) - v[1] * Math.sin(theta);
    var yp = v[0] * Math.sin(theta) + v[1] * Math.cos(theta);
    return [xp, yp];
  }

  function e_op(a, b, op) {
    function o(v1, v2) {
      switch (op) {
        case "add":
          return v1 + v2;
        case "sub":
          return v1 - v2;
        case "mul":
          return v1 * v2;
        case "div":
          return v1 / v2;
      }
    }


    var vector1 = null;
    var vector2 = null;
    var scalar1 = null;
    var scalar2 = null;

    // Distinguish what is what
    if (a.length) {
      vector1 = a;
    } else {
      scalar1 = a;
    }

    if (b.length) {
      vector2 = b;
    } else {
      scalar2 = b;
    }

    var r, i, l;
    if (vector1 !== null && vector2 !== null) {
      ensure_dimension(vector1, vector2);
      r = [];
      for (i=0, l=vector1.length; i<l; i++) {
        r.push(o(vector1[i], vector2[i]));
      }
    } else if (scalar1 !== null && scalar2 !== null) {
      r = o(scalar1, scalar2);
    } else if (vector1 !== null && scalar2 !== null) {
      r = [];
      for (i=0, l=vector1.length; i<l; i++) {
        r.push(o(vector1[i], scalar2));
      }
    } else if (scalar1 !== null && vector2 !== null) {
      r = [];
      for (i=0, l=vector2.length; i<l; i++) {
        r.push(o(scalar1, vector2[i]));
      }
    }

    return r;
  }

  function e_add(a, b) {
    return e_op(a, b, "add");
  }

  function e_sub(a, b) {
    return e_op(a, b, "sub");
  }

  function e_mul(a, b) {
    return e_op(a, b, "mul");
  }

  function e_div(a, b) {
    return e_op(a, b, "div");
  }

  function round(v, digits) {
    var m = Math.pow(10, digits);
    return Math.round(v * m) / m;
  }

  return {
    e: {
      add: e_add,
      sub: e_sub,
      mul: e_mul,
      div: e_div,
    },
    cross: cross,
    dot: dot,
    norm: norm,
    round: round,
    rotate: rotate,
    MathError: MathError,
    DimensionMismatchError: DimensionMismatchError
  };
})();
