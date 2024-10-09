import Matter from 'matter-js';
import 'pathseg';

const $horizontal03 = document.querySelector('.section-popee__horizontal-03');
const canvas = document.querySelector('.section-popee__canvas');

const cw = $horizontal03.offsetWidth;
const ch = $horizontal03.offsetHeight;

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
  Common,
  Svg,
  World,
} = Matter;

Common.setDecomp(require('poly-decomp'));

const engine = Engine.create({ enableSleeping: true });
const world = engine.world;

const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: cw,
    height: ch,
    wireframes: false,
    background: 'transparent',
    showSleeping: false,
  },
});

// Render.run(render);

const runner = Runner.create();
// Runner.run(runner, engine);

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.8,
    render: {
      visible: false,
    },
  },
});

Composite.add(world, mouseConstraint);

mouse.element.removeEventListener('wheel', mouse.mousewheel);
mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

// 벽
const wallWidth = 10;
const walls = [
  Bodies.rectangle(-wallWidth / 2, ch / 2, wallWidth, ch, {
    label: 'left_wall',
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }),
  Bodies.rectangle(cw + wallWidth / 2, ch / 2, wallWidth, ch, {
    label: 'right_wall',
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }),
  Bodies.rectangle(cw / 2, ch + wallWidth / 2, cw, wallWidth, {
    label: 'bottom_wall',
    isStatic: true,
    render: { fillStyle: 'transparent' },
  }),
];

Composite.add(world, walls);

// svg
let scale;
if (cw >= 1600) scale = 1;
else if (cw >= 1300) scale = 0.85;
else if (cw >= 1024) scale = 0.65;
else if (cw >= 600) scale = 0.5;
else if (cw >= 470) scale = 0.4;
else scale = 0.3;

const svgPathArr = Array.from(
  document.querySelectorAll('.section-popee__svg svg path')
);
const svgVerticesArr = svgPathArr.map((path) =>
  Vertices.scale(Svg.pathToVertices(path), scale, scale)
);
const svgColorArr = [
  '#FFBDC1',
  '#FFA5AB',
  '#DA627D',
  '#A53860',
  '#450920',
  '#981648',
  '#CD3B5B',
];

let i = -1;

const stack = Composites.stack(0, 0, 3, 3, 0, 0, (x, y) => {
  i++;
  return (
    svgVerticesArr[i] &&
    Bodies.fromVertices(x, y, svgVerticesArr[i], {
      density: 0.01,
      friction: 1,
      render: {
        fillStyle: svgColorArr[i],
        strokeStyle: svgColorArr[i],
        lineWidth: 1,
      },
    })
  );
});

Composite.add(world, stack.bodies);

const $canvasTextArr = document.querySelectorAll(
  '.section-popee__horizontal-03 .canvas-text'
);

function renderText() {
  $canvasTextArr.forEach((text, i) => {
    text.style.top = `${stack.bodies[i].position.y}px`;
    text.style.left = `${stack.bodies[i].position.x}px`;
  });
  requestAnimationFrame(renderText);
}
renderText();

export default function runMatter() {
  Render.run(render);
  Runner.run(runner, engine);
}