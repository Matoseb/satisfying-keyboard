class Key {
  constructor(opts = {}) {
    const defaults = {
      round: 10,
      depth: 10,
      minDepth: 5,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      textHeight: 10,
      text: Math.random().toString(36)[2].toUpperCase(),
      c: null, //htmlCanvas context 2d
    };

    Object.assign(this, defaults, opts);

    this.hHeight = this.height * 0.5;
    this.hWidth = this.width * 0.5;
    this.currDepth = this.targDepth = this.depth;

    this.textWidth = this.c.measureText(this.text).width;
  }

  update() {
    this.checkCollide();
    this.smoothenDepth();
  }

  smoothenDepth() {
    this.currDepth = UTILS.lerp(this.currDepth, this.targDepth, 0.4);
  }

  drawText() {
    let { c, currDepth, text } = this;

    c.save();
    c.translate(currDepth, -currDepth);
    c.translate(this.x - this.textWidth / 2, this.y + this.textHeight / 4);
    this.c.fillText(text, 0, 0);
    c.restore();
  }

  checkCollide() {
    let { depth } = this;
    let { sq } = UTILS;

    let centerX = this.x + depth;
    let centerY = this.y - depth;

    // let x1 = this.x + depth - this.hWidth;
    // let y1 = this.y - depth - this.hHeight;
    // let x2 = x1 + this.width;
    // let y2 = y1 + this.height;
    let p = mouse.mapped;
    let i = p.length;
    let force = 80;

    for (; i--; ) {
      let x = p[i].x;
      let y = p[i].y;
      let forceAmt = -(sq(centerX - x) + sq(centerY - y)) / sq(force);
      depth -= force * Math.pow(2, forceAmt);
    }

    this.targDepth = Math.max(depth, this.minDepth);

    // if(
    //   mouse.pressed &&
    //   mouse.px > x1 &&
    //   mouse.px < x2 &&
    //   mouse.py > y1 &&
    //   mouse.py < y2
    // )
    // this.targDepth = 0;
    // else this.targDepth = depth;
    // let dist
    // let amt = Math.min(1, dist);
  }

  drawCap() {
    let { c, currDepth } = this;

    c.save();
    c.translate(currDepth, -currDepth);
    c.translate(this.x - this.hWidth, this.y - this.hHeight);
    this.roundRect(this.width, this.height, this.round);

    c.restore();
  }

  drawSides() {
    let { c } = this;

    c.save();

    c.translate(this.x - this.hWidth, this.y - this.hHeight);
    this.halfRoundRect(this.width, this.height, this.round);

    c.restore();
  }

  halfRoundRect(w, h, r) {
    let { c } = this;
    let { halfPI } = UTILS;
    let { PI } = Math;
    let { currDepth } = this;

    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;

    let wr = w - r;
    let hr = h - r;
    let a = 0.8;

    c.moveTo(r + currDepth, -currDepth);
    c.arc(wr + currDepth, r - currDepth, r, -halfPI, 0);
    c.arc(wr + currDepth, hr - currDepth, r, 0, halfPI - a);

    c.arc(wr, hr, r, halfPI - a, halfPI);

    c.arc(r, hr, r, halfPI, PI);
    c.arc(r, r, r, PI, halfPI + PI - a);

    c.arc(r + currDepth, r - currDepth, r, PI + a, halfPI + PI);

    return c;
  }

  roundRect(w, h, r) {
    let { c } = this;
    let { halfPI } = UTILS;
    let { PI } = Math;

    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;

    let wr = w - r;
    let hr = h - r;

    c.moveTo(r, 0);
    c.arc(wr, r, r, -halfPI, 0);
    c.arc(wr, hr, r, 0, halfPI);
    c.arc(r, hr, r, halfPI, PI);
    c.arc(r, r, r, PI, halfPI + PI);
    return c;
  }
}
