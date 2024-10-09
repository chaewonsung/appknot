import '../css/main.scss';

import toggleClassWithIo from './utils/toggleClassWithIo.js';
import toPX from './utils/toPX.js';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Line from '../components/Line.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// https://appknot.com/

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  new Header(document.querySelector('.header'));
  new Footer(document.querySelector('.footer'));

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
