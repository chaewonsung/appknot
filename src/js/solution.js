// https://appknot.com/

import '../css/solution.scss';
import runMatter from './solution_canvas.js';

import splitTextIntoSpan from './utils/splitTextIntoSpan.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { debounce } from 'lodash';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Line from '../components/Line.js';

document.addEventListener('DOMContentLoaded', (event) => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  new Header(document.querySelector('.header'));
  new Footer(document.querySelector('.footer'));

  splitTextIntoSpan('.gradient-text-01');
  splitTextIntoSpan('.gradient-text-02');

  /* hgroup__h1 animation */
  splitTextIntoSpan('hgroup h1');

  const $hgroupH1Arr = gsap.utils.toArray('hgroup h1');
  const hgroupH1SeletorArr = $hgroupH1Arr.map((elem) =>
    gsap.utils.selector(elem)
  );

  const hgroupH1TweenArr = hgroupH1SeletorArr.map((selector) => {
    gsap.set('hgroup h1 span', { display: 'inline-block', opacity: 0 });
    return gsap.fromTo(
      selector('span'),
      { yPercent: 30, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
        paused: true,
      }
    );
  });

  $hgroupH1Arr.forEach((elem, i) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio) {
            hgroupH1TweenArr[i].play();
          }
        });
      },
      { threshold: 0.5 }
    ).observe(elem);
  });

  // unobserve 추가해야함

  /* article h1 animation */
  splitTextIntoSpan('.article__h1 .row');

  const $articleH1Arr = gsap.utils.toArray('.article__h1');
  const articleH1SeletorArr = $articleH1Arr.map((elem) =>
    gsap.utils.selector(elem)
  );

  const articleH1TweenArr = articleH1SeletorArr.map((selector) => {
    const duration = 0.8;

    gsap.set('.article__h1 span', { display: 'inline-block', opacity: 0 });
    return gsap
      .timeline({ paused: true })
      .fromTo(
        selector('.row:first-child span'),
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: duration,
          stagger: { amount: duration },
        }
      )
      .fromTo(
        selector('.row:nth-child(2) span'),
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: duration,
          stagger: { amount: duration },
        },
        0
      )
      .fromTo(
        selector('.img-box'),
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1 }
      )
      .to(selector('.img-box'), {
        yPercent: -10,
      })
      .to(selector('.img-box'), {
        yPercent: 10,
        repeat: -1,
        ease: 'none',
        yoyo: true,
        duration: 2,
      });
  });

  $articleH1Arr.forEach((elem, i) => {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio) {
            articleH1TweenArr[i].play();
          }
        });
      },
      { threshold: 0.5 }
    ).observe(elem);
  });

  /* section-index.js */
  const $indexSec = document.querySelector('.section-index');
  const $3 = $indexSec.querySelector('._3');
  const $solutions = $indexSec.querySelector('.solutions');

  $indexSec.querySelectorAll('.line').forEach((line) => new Line(line));

  const tagTween = gsap.fromTo(
    '.section-index__text .tag',
    { yPercent: () => 350, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 0.5,
      paused: true,
    }
  );

  gsap
    .timeline({
      scrollTrigger: {
        trigger: $indexSec,
        start: '0 0',
        end: '+=1000',
        // markers: true,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh() {
          // sync 'solutions' position in opening section
          gsap.set('.section-opening .solutions', {
            paddingLeft: $solutions.getBoundingClientRect().left,
          });
        },
      },
    })
    .fromTo(
      '.section-index__text .row2 > p',
      { x: () => -$3.offsetWidth },
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
  let $popeeSecInner = document.querySelector('.section-popee__inner');

  const popeeSecTween = gsap.to('.section-popee__inner', {
    keyframes: {
      '5%': { x: 0 },
      '95%': { x: () => -($popeeSecInner.offsetWidth - innerWidth) },
    },
    ease: 'none',
    scrollTrigger: {
      trigger: '.section-popee',
      start: '0 0',
      end: () => `+=${$popeeSecInner.offsetWidth - innerWidth}`,
      pin: true,
      scrub: 1,
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
        start: '30% right',
        // markers: true,
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

  // text rotation
  gsap.set('.section-popee__horizontal-02 .article', { opacity: 0 });

  ScrollTrigger.create({
    trigger: '.section-popee__horizontal-02 .article',
    containerAnimation: popeeSecTween,
    start: '50% right',
    // markers: true,
    onEnter(self) {
      gsap.set(self.trigger, { opacity: 1 });
      self.trigger.classList.add('active');
    },
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
      onEnter() {
        runMatter();
      },
    },
  });

  /* section-closing.js */
  splitTextIntoSpan('.section-closing__text .big-text-box > *');

  const getRandomBetween = (min, max) => Math.random() * (max - min) + min;
  const closingSec = gsap.utils.selector('.section-closing');

  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.section-closing',
        start: 'top center',
      },
    })
    .add(
      closingSec('.big-text-box span').map((span) =>
        gsap.fromTo(
          span,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, delay: getRandomBetween(0, 1.5) }
        )
      )
    )
    .fromTo(
      closingSec('.small-text-box .en'),
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
    .fromTo(
      closingSec('.small-text-box .ko'),
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
    .from(closingSec('.tag'), {
      opacity: 0,
      bottom: 0,
      ease: 'elastic.out',
      duration: 2,
    });

  function handleResize() {
    // solutionsX = $indexSec
    //   .querySelector('.solutions')
    //   .getBoundingClientRect().left;
    // console.log(solutionsX);
    // console.dir(solutionsSet)
    // solutionsSet.resetTo('paddingLeft', solutionsX)
    // section-popee resize
  }

  window.onresize = debounce(handleResize, 200);
});
