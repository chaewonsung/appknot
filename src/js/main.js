import '../css/main.scss';

import toggleClassWithIo from './utils/toggleClassWithIo.js';
import toPX from './utils/toPX.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import $ from 'jquery';
import { debounce } from 'lodash';

import {
  yellowPath,
  bluePath,
  purplePath,
  mintPath,
} from '../data/main_canvas_path';
import Matter from 'matter-js';

// https://appknot.com/

window.onload = function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* Matter JS */
  (function () {
    const canvas = $('.section-intro__canvas')[0];
    const cw = $('.section-intro').innerWidth();
    const ch = $('.section-intro').innerHeight();

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
  })();

  /* intro-text.js */
  ScrollTrigger.create({
    trigger: '.intro-text',
    start: 'top top',
    onEnter: (self) => self.trigger.classList.add('on'),
    onLeaveBack: (self) => self.trigger.classList.remove('on'),
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
          $('.section-about__contents-bg').innerHeight(
            $('.section-about__contents').outerHeight(true)
          );
        },
        onLeave() {
          $('.container').addClass('header-on');
        },
        onEnterBack() {
          $('.container').removeClass('header-on');
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

  /* section-work.js */
  const workSecTween = gsap.fromTo(
    '.section-work__list',
    { x: 0 },
    {
      keyframes: {
        '5%': { x: 0 },
        '95%': {
          x: (i, target) => -(target.offsetWidth - document.body.clientWidth),
          ease: 'none',
        },
      },
      paused: true,
    }
  );

  ScrollTrigger.create({
    id: 'a',
    trigger: '.section-work',
    end:
      '+=' +
      ($('.section-work__list').outerWidth() - document.body.clientWidth),
    pin: true,
    anticipatePin: 0.5,
    // scrub: 0,
    invalidateOnRefresh: true,
    onRefresh: () => {
      workSecTween.vars.keyframes['95%'].x = -(
        $('.section-work__list').outerWidth() - document.body.clientWidth
      );
      workSecTween.invalidate();
    },
    onUpdate: debounce(
      () =>
        gsap.to(workSecTween, {
          progress: ScrollTrigger.getById('a').progress,
          ease: 'power2.inOut',
        }),
      50
    ),
  });

  $('.section-work__item').each(function (i, item) {
    $(item).on({
      mouseleave: () => {
        $('.section-work__hover-text').css('opacity', 0).text('');
      },
      mousemove: ({ originalEvent: e }) => {
        $('.section-work__hover-text')
          .text(`${item.dataset.hover}`)
          .css({
            opacity: 1,
            top: `${
              e.clientY - $('.section-work')[0].getBoundingClientRect().top
            }px`,
            left: `${e.clientX}px`,
          });
      },
    });
  });

  /* section-insight.js */
  gsap
    .timeline({
      scrollTrigger: {
        id: 'insightSecST',
        trigger: '.section-insight',
        start: 'top top',
        end: '+=1000',
        pin: true,
        anticipatePin: 0.5,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    })
    .to('.section-insight .card--handly', {
      xPercent: () => -130,
      rotation: 30,
    })
    .to(
      '.section-insight .card--mentor',
      { xPercent: () => 130, rotation: 15 },
      0
    );

  /* section-recruit.js */
  // change bg-color
  toggleClassWithIo($('.section-recruit')[0], 'in', { threshold: 0.3 });

  // slider
  let initialProgress;

  const sliderScrolltrigger = ScrollTrigger.create({
    trigger: '.slider',
    end: '+=400%',
    scrub: 1,
    onUpdate({ progress, direction, trigger }) {
      if (!initialProgress) {
        initialProgress = progress;
      }
      gsap.to(trigger, {
        rotationY:
          '+=' + Math.abs(initialProgress - progress) * 360 * direction,
        overwrite: true,
        ease: 'none',
        onComplete() {
          initialProgress = 0;
        },
      });
    },
  });

  let isMouseDown = false;
  let movementX;

  $('.slider').on({
    mousedown: () => {
      isMouseDown = true;
      sliderScrolltrigger.disable();
      movementX = 0;
    },
    mousemove: (e) => {
      if (isMouseDown) {
        movementX += e.originalEvent.movementX;

        gsap.to('.slider', {
          rotationY: '+=' + movementX * -0.2,
          overwrite: true,
          duration: 1,
          onComplete() {
            sliderScrolltrigger.enable();
          },
        });
      }
    },
    mouseup: () => (isMouseDown = false),
  });

  ScrollTrigger.create({
    trigger: '.section-recruit',
    start: 'top top',
    onEnter: () => $('.container').removeClass('header-on'),
    onLeaveBack: () => $('.container').addClass('header-on'),
  });

  import('./common.js');
};
