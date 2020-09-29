window.addEventListener("load", load);

let cv, c, px, width, height;

let keys = [];

let mouse = {
  pos: [],
  mapped: [],
  pressed: false,
};

let keyWidth = 50;
let keyHeight = 50;
let depth =30;
let textHeight = keyWidth / 3;

function load() {
  px = 1 || window.devicePixelRatio;
  cv = document.createElement("canvas");
  c = cv.getContext("2d");

  document.body.appendChild(cv);

  resize();

  generateKeys();

  window.addEventListener("resize", (e) => {
    resize(e);
    generateKeys();
  });
  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mousedown", mousedown);
  window.addEventListener("mouseup", mouseup);


  window.addEventListener("touchmove", touchHandle);
  window.addEventListener("touchend", touchHandle);
  window.addEventListener("touchstart", touchHandle);

  window.requestAnimationFrame(animationFrame);
}

function touchHandle(e) {
    let {pos} = mouse
    pos.length = 0;

    for(let {pageX, pageY} of e.touches) {
        pos.push({x: pageX, y: pageY})
    }

    e.preventDefault();
   
}

function generateKeys() {
  let gap = 10;
  let round = 7;

  let offsetX = keyWidth + gap;
  let offsetY = keyHeight + gap;
  let totalX = Math.floor(Math.hypot(width, height) / keyWidth);
  //   console.log(width/keyWidth);
  let totalY = totalX;

  keys.length = 0;
  for (let x = 0; x < totalX; x++) {
    for (let y = 0; y < totalY; y++) {
      keys.push(
        new Key({
          c,
          textHeight,
          depth,
          round,
          height: keyHeight,
          width: keyWidth,
          x: (x - (totalX - 1) / 2) * offsetX,
          y: -(y - (totalY - 1) / 2) * offsetY,
        })
      );
    }
  }
}

function mousemove(e) {
  if (mouse.pressed) {
    mouse.pos = [{ x: e.pageX, y: e.pageY }];
  }
}

function mousedown() {
  mouse.pressed = true;
}

function mouseup(e) {
  mouse.pos.length = 0;
  mouse.pressed = false;
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  cv.style.width = `${width}px`;
  cv.style.height = `${height}px`;

  cv.width = width * px;
  cv.height = height * px;
}

function animationFrame() {
  c.save();
  c.scale(px, px);
  update();
  c.restore();

  window.requestAnimationFrame(animationFrame);
}

function update() {
  c.fillStyle = "white";
  c.fillRect(0, 0, width, height);

  c.strokeStyle = "black";

  c.translate(width / 2, height / 2);

  //   c.scale(5, 5);

  c.strokeStyle = "black";
  c.lineWidth = 2;

  UTILS.isoProject(c);

  mouse.mapped.length = 0;

  for (let m of mouse.pos) {
    mouse.mapped.push(
      UTILS.screenToWorld(m.x, m.y, {
        context: c,
        pixelDensity: px,
      })
    );
  }

  c.font = `${textHeight}px sans-serif`;

  let i = keys.length;

  for (; i--; ) {
    let key = keys[i];

    key.update();
    c.beginPath();
    key.drawSides();
    c.fillStyle = "black";
    c.stroke();
    c.fill();

    c.beginPath();
    key.drawCap();

    c.fillStyle = "white";
    c.fill();
    c.fillStyle = "black";
    key.drawText(textHeight);
    c.stroke();
  }
}
