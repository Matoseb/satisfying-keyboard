const UTILS = {
  roundRect(c, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    return c;
  },

  halfPI: Math.PI * 0.5,

  isoProject(c) {
    // return;

    const angle = 0.523599;
    c.rotate(-angle);
    c.transform(1, 0, Math.tan(angle), 1, 0, 0);
    c.scale(1, 0.86062);
  },

  screenToWorld(x, y, opts) {
    let defaults = {
      pixelDensity: window.devicePixelRatio,
      context: undefined,
      matrix: undefined,
    };

    opts = Object.assign(defaults, opts);

    let matrix = opts.matrix || opts.context.getTransform();
    let imatrix = matrix.invertSelf();
    let px = opts.pixelDensity;

    x *= px;
    y *= px;

    return {
      x: x * imatrix.a + y * imatrix.c + imatrix.e,
      y: x * imatrix.b + y * imatrix.d + imatrix.f,
    };
  },

  sq(value) {
      return value*value;
  },

  map(num, start1, stop1, start2, stop2) {
    return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  },

  lerp(start, stop, amt) {
    return amt * (stop - start) + start;
  },
};
