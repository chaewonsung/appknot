// https://appknot.com/

import Matter from 'matter-js';
import 'pathseg';

import '../css/solution.scss';

import splitTextIntoSpan from './utils/splitTextIntoSpan.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { debounce } from 'lodash';
import $ from 'jquery';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Line from '../components/Line.js';

window.onload = () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  new Header(document.querySelector('.header'));
  new Footer(document.querySelector('.footer'));

  // Matter JS
  const runMatter = (function () {
    const $horizontal03 = document.querySelector(
      '.section-popee__horizontal-03'
    );
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

    return function runMatter() {
      Render.run(render);
      Runner.run(runner, engine);
    };
  })();

  splitTextIntoSpan('.gradient-text-01');
  splitTextIntoSpan('.gradient-text-02');

  /* section-index.js */
  $('.section-index')
    .children('.line')
    .each((i, line) => new Line(line));

  const tagTween = gsap.fromTo(
    '.section-index__text .tag',
    { yPercent: () => 350, autoAlpha: 0 },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.3,
      paused: true,
    }
  );

  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.section-index',
        end: '+=1000',
        pin: true,
        scrub: 0,
        invalidateOnRefresh: true,
        onRefresh() {
          gsap.set('.section-opening .solutions', {
            paddingLeft: $('.section-index__text .row2').offset().left,
          });
        },
      },
    })
    .fromTo(
      '.section-index__text .solutions',
      { x: () => -$('._3').outerWidth() },
      {
        keyframes: {
          '40%': {
            x: 0,
            onComplete() {
              tagTween.play();
            },
            onReverseComplete() {
              tagTween.reverse();
            },
          },
        },
      }
    )
    .fromTo(
      '.section-index__img .image-container',
      { yPercent: (i) => 70 * (i + 1) },
      { yPercent: 0 },
      0
    );

  /* section-popee.js */
  const popeeSecTween = gsap.to('.section-popee__inner', {
    keyframes: {
      '5%': { x: 0 },
      '95%': {
        x: (i, target) => -(target.offsetWidth - innerWidth),
      },
    },
    ease: 'none',
    scrollTrigger: {
      trigger: '.section-popee',
      end: () => `+=${$('.section-popee__inner').outerWidth() - innerWidth}`,
      pin: true,
      scrub: 0,
      invalidateOnRefresh: true,
    },
  });

  //horizontal-02
  const horizontal02 = gsap.utils.selector('.section-popee__horizontal-02');

  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.section-popee__horizontal-02',
        containerAnimation: popeeSecTween,
        start: '50% right',
      },
    })
    .fromTo(
      horizontal02('.img-box'),
      { yPercent: 300 },
      { yPercent: 0, duration: 1 }
    )
    .fromTo(
      horizontal02('.img-box .text-img'),
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.2'
    )
    .fromTo(
      horizontal02('.bg'),
      { width: '0%' },
      { width: '100%', duration: 3 },
      0
    );

  ScrollTrigger.create({
    trigger: horizontal02('.article'),
    containerAnimation: popeeSecTween,
    start: 'right+=80% right',
    // markers: true,
    onEnter: () =>
      gsap.set(horizontal02('.rotate-wrapper span'), {
        animationPlayState: 'running',
      }),
  });

  // horizontal-03
  // wall
  gsap.to('.section-popee__horizontal-03 .wall--left', {
    yPercent: -50,
    scrollTrigger: {
      trigger: '.section-popee__horizontal-03 .wall--left',
      containerAnimation: popeeSecTween,
      start: '20% right',
      scrub: 2,
      onEnter: runMatter,
    },
  });

  /* section-closing.js */
  splitTextIntoSpan('.section-closing__text .big-text-box > *');

  const closingSec = gsap.utils.selector('.section-closing');
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.section-closing',
        start: 'top center',
      },
    })
    .fromTo(
      closingSec('.big-text-box span'),
      { autoAlpha: 0 },
      { autoAlpha: 1, stagger: { amount: 1.5, from: 'random' } }
    )
    .fromTo(
      closingSec('.small-text-box > *'),
      { autoAlpha: 0 },
      { autoAlpha: 1, stagger: 0.3 },
      '<+=0.8'
    )
    .from(
      closingSec('.tag'),
      {
        autoAlpha: 0,
        bottom: 0,
        ease: 'elastic.out',
        duration: 2,
        stagger: 0.2,
      },
      '>'
    );

  /* hgroup__h1 animation */
  splitTextIntoSpan('hgroup h1');
  gsap.set('hgroup h1 span', {
    display: 'inline-block',
    yPercent: 30,
    autoAlpha: 0,
  });

  gsap.utils.toArray('hgroup h1').forEach((elem) => {
    ScrollTrigger.create({
      trigger: elem,
      onEnter: (self) => {
        gsap.to(self.trigger.querySelectorAll('span'), {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.1,
        });
      },
    });
  });

  /* article h1 animation */
  splitTextIntoSpan('.article__h1 .row');
  gsap.set('.article__h1 span', {
    display: 'inline-block',
    yPercent: 30,
    autoAlpha: 0,
  });
  gsap.set('.article__h1 .img-box', { yPercent: 100, autoAlpha: 0 });
  gsap.utils.toArray('.article__h1').forEach((elem, i) => {
    ScrollTrigger.create({
      trigger: elem,
      start: i === 1 ? 'left right' : 'bottom bottom',
      containerAnimation: i === 1 ? popeeSecTween : null,
      onEnter: (self) =>
        gsap
          .timeline()
          .to(self.trigger.querySelectorAll('.row span'), {
            yPercent: 0,
            autoAlpha: 1,
            stagger: 0.05,
          })
          .to(self.trigger.querySelectorAll('.img-box'), {
            autoAlpha: 1,
            yPercent: -10,
            duration: 0.8,
          })
          .to(self.trigger.querySelectorAll('.img-box'), {
            yPercent: 10,
            repeat: -1,
            yoyo: true,
            ease: 'none',
            duration: 1.5,
          }),
    });
  });

  /* rotate-text */
  gsap.utils.toArray('.rotate-point').forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top bottom',
      onEnter: (self) => self.trigger.classList.add('in'),
    });
  });
};
