import {
  yellowPath,
  bluePath,
  purplePath,
  mintPath,
} from '../data/main_canvas_path';
import Matter from 'matter-js';

const $introSec = document.querySelector('.section-intro');
const canvas = document.querySelector('.section-intro__canvas');
const cw = $introSec.offsetWidth;
const ch = $introSec.offsetHeight;

const {
  Engine,
  Bodies,
  Runner,
  Render,
  Mouse,
  MouseConstraint,
  Vertices,
  Composite,
  Composites,
  Events,
  Common,
} = Matter;

Common.setDecomp(require('poly-decomp'));

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: cw,
    height: ch,
    wireframes: false,
    background: 'transparent',
  },
});

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
});

mouse.element.removeEventListener('wheel', mouse.mousewheel);
mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

let scale;
if (cw >= 1600) scale = 0.8;
else if (cw >= 1300) scale = 0.7;
else if (cw >= 1024) scale = 0.55;
else if (cw >= 600) scale = 0.4;
else if (cw >= 470) scale = 0.3;
else scale = 0.2;

class Symbol {
  constructor(path, name) {
    this.name = name;
    this.path = path;
    this.src = `/src/image/${name}.webp`;
    this.width = this.getWidth();
    this.height = this.getHeight();
    this.scaledPath = this.scalePath();
  }
  getWidth() {
    let minX = 9999;
    let maxX = 0;
    for (let i = 0; i < this.path.length; i++) {
      minX = Math.min(minX, this.path[i].x);
      maxX = Math.max(maxX, this.path[i].x);
    }
    return maxX - minX;
  }
  getHeight() {
    let minY = 9999;
    let maxY = 0;
    for (let i = 0; i < this.path.length; i++) {
      minY = Math.min(minY, this.path[i].y);
      maxY = Math.max(maxY, this.path[i].y);
    }
    return maxY - minY;
  }
  scalePath() {
    return Vertices.scale(this.path, scale, scale);
  }
}

const yellowSymbol = new Symbol(yellowPath, 'yellow_symbol');
const blueSymbol = new Symbol(bluePath, 'blue_symbol');
const mintSymbol = new Symbol(mintPath, 'mint_symbol');
const purpleSymbol = new Symbol(purplePath, 'purple_symbol');

const symbols = [yellowSymbol, blueSymbol, mintSymbol, purpleSymbol];

let stackCount = -1;
const stack = Composites.stack(20, -500, 2, 2, 0, 0, (x, y) => {
  stackCount++;
  return Bodies.fromVertices(x, y, symbols[stackCount].scaledPath, {
    label: symbols[stackCount].name,
    render: {
      sprite: {
        texture: symbols[stackCount].src,
        xScale: scale,
        yScale: scale,
      },
    },
  });
});

Composite.add(world, stack);

// 벽
const wallWidth = 1;

Composite.add(world, [
  Bodies.rectangle(-wallWidth / 2, ch / 2, wallWidth, ch, {
    label: 'left_wall',
    isStatic: true,
    render: { fillStyle: '#00000000' },
  }),
  Bodies.rectangle(cw + wallWidth / 2, ch / 2, wallWidth, ch, {
    label: 'right_wall',
    isStatic: true,
    render: { fillStyle: '#00000000' },
  }),
  Bodies.rectangle(cw / 2, ch + wallWidth / 2, cw, wallWidth, {
    label: 'bottom_wall',
    isStatic: true,
    render: { fillStyle: '#00000000' },
  }),
]);

let collisionOnGround = 0;
Events.on(engine, 'collisionStart', (e) => {
  const pairs = e.pairs[0];
  if (pairs.bodyB.label === 'bottom_wall') collisionOnGround++;
  if (collisionOnGround >= 2) {
    Composite.add(
      world,
      Bodies.rectangle(cw / 2, -wallWidth / 2, cw, wallWidth, {
        label: 'top_wall',
        isStatic: true,
        render: { fillStyle: '#00000000' },
      })
    );
    Composite.add(world, mouseConstraint);

    Events.off(engine, 'collisionStart');
  }
});

Events.on(mouseConstraint, 'startdrag', () => {
  engine.gravity.y = 0;
  Events.off(mouseConstraint, 'startdrag');
});
