import '../css/main.scss';

import toggleClassWithIo from './utils/toggleClassWithIo.js';
import toPX from './utils/toPX.js';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Line from '../components/Line.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import {
  yellowPath,
  bluePath,
  purplePath,
  mintPath,
} from '../data/main_canvas_path';
import Matter from 'matter-js';

// https://appknot.com/

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  new Header(document.querySelector('.header'));
  new Footer(document.querySelector('.footer'));

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
      this.src = `src/image/${name}.webp`;
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

  /* rotate-text */
  document.querySelectorAll('.rotate').forEach((elem) => {
    new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          elem.classList.add('in');
          observer.unobserve(elem);
        }
      });
    }).observe(elem);
  });

  /* intro-text.js */
  ScrollTrigger.create({
    trigger: '.intro-text',
    start: 'top top',
    onEnter(self) {
      self.trigger.classList.add('on');
    },
    onLeaveBack(self) {
      self.trigger.classList.remove('on');
    },
  });

  /* section-about.js */
  gsap.fromTo(
    '.section-about__bg .img-box',
    { scale: 0.25, borderRadius: 30 },
    {
      scale: 1,
      borderRadius: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-about__bg',
        start: 'top top',
        end: '+=800',
        pin: true,
        anticipatePin: 0.5,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh() {
          setContentsBg();
        },
        onLeave() {
          gsap.to('.intro-text__main svg g', {
            fill: 'rgb(255,255,255)',
            stroke: 'rgb(255,255,255)',
          });
          document.querySelector('.header').classList.add('on');
        },
        onEnterBack() {
          gsap.to('.intro-text__main svg g', {
            fill: 'rgb(0,0,0)',
            stroke: 'rgb(0,0,0)',
          });
          document.querySelector('.header').classList.remove('on');
        },
      },
    }
  );

  gsap.fromTo(
    '.section-about__bg img',
    { objectPosition: 'center 0px' },
    {
      objectPosition: () => `center ${toPX('-50vw')}px`,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-about__bg',
        start: 'top top',
        end: '+=800',
        scrub: 0,
        invalidateOnRefresh: true,
      },
    },
    0
  );

  function setContentsBg() {
    const $aboutSecContents = document.querySelector(
      '.section-about__contents'
    );
    const $aboutSecContentsBg = document.querySelector(
      '.section-about__contents-bg'
    );

    $aboutSecContentsBg.style.height =
      $aboutSecContents.offsetHeight +
      parseFloat(window.getComputedStyle($aboutSecContents).marginTop) +
      'px';

    $aboutSecContentsBg.style.marginTop =
      -$aboutSecContentsBg.offsetHeight + 'px';
  }

  /* section-work.js */
  const workList = document.querySelector('.section-work__list');

  gsap.to('.section-work__list', {
    scrollTrigger: {
      trigger: '.section-work',
      start: 'top top',
      end: () => '+=' + workList.offsetWidth,
      pin: true,
      anticipatePin: 0.5,
      scrub: 1,
      invalidateOnRefresh: true,
    },
    keyframes: {
      '10%': { x: 0 },
      '90%': {
        x: () => -(workList.offsetWidth - document.body.clientWidth),
      },
    },
  });

  gsap.utils.toArray('.section-work__item').forEach((item) => {
    item.addEventListener('mousemove', (e) => {
      item.querySelector('.hover-text').style.top = e.offsetY + 'px';
      item.querySelector('.hover-text').style.left = e.offsetX + 'px';
    });
  });

  /* section-insight.js */
  const $insightSec = document.querySelector('.section-insight');

  gsap
    .timeline({
      scrollTrigger: {
        trigger: $insightSec,
        start: 'top top',
        end: '+=1000',
        pin: true,
        anticipatePin: 0.5,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
    .to('.section-insight .card--handly', {
      x: () => -$insightSec.clientWidth / 2,
      rotation: 30,
    })
    .to(
      '.section-insight .card--mentor',
      { x: () => $insightSec.clientWidth / 2, rotation: 15 },
      0
    );

  /* section-recruit.js */
  const $recruitSec = document.querySelector('.section-recruit');

  // create line
  $recruitSec.querySelectorAll('.line').forEach((line) => new Line(line));

  // change bg-color
  toggleClassWithIo($recruitSec, 'in', { threshold: 0.3 });

  // slider
  const $slider = document.querySelector('.slider');

  let initialProgress;

  const sliderScrolltrigger = ScrollTrigger.create({
    trigger: $slider,
    endTrigger: '.footer',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate({ progress, direction }) {
      if (!initialProgress) {
        initialProgress = progress;
      }
      gsap.to($slider, {
        rotationY:
          '+=' + Math.abs(initialProgress - progress) * 360 * direction,
        overwrite: true,
        onComplete() {
          initialProgress = 0;
        },
      });
    },
  });

  let isMouseDown = false;
  let movementX;

  $slider.addEventListener('mousedown', () => {
    isMouseDown = true;
    sliderScrolltrigger.disable();
    movementX = 0;
  });
  $slider.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
      movementX += e.movementX;

      gsap.to($slider, {
        rotationY: '+=' + movementX * -0.2,
        overwrite: true,
        duration: 1,
        onComplete() {
          sliderScrolltrigger.enable();
        },
      });
    }
  });
  $slider.addEventListener('mouseup', () => {
    isMouseDown = false;
  });
});
