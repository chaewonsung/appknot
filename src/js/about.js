// https://appknot.com/
import '../css/about.scss';

import splitTextIntoSpan from './utils/splitTextIntoSpan.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import _ from 'lodash';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import $ from 'jquery';

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  new Header(document.querySelector('.header'));
  new Footer(document.querySelector('.footer'));

  /**
   * section-history.js
   */

  // year overlap
  const $introSec = document.querySelector('.section-intro');

  // $introSec.style.marginBottom =
  //   -($introSec.offsetHeight - innerHeight || 0) + 'px';

  $('.section-intro').css(
    'marginBottom',
    -($introSec.offsetHeight - innerHeight || 0)
  );

  // ipad animation
  ScrollTrigger.create({
    trigger: '.section-history__contents',
    end: '+=1000',
    pin: true,
    onUpdate({ progress, direction }) {
      if (Math.floor(progress * 10) / 10 === 0.5) {
        direction === 1 ? screenTl.play() : screenTl.reverse();
      }
    },
  });

  const screenTl = gsap
    .timeline({ paused: true })
    .to('.ipad__screen img', { xPercent: -100, ease: 'power1.inOut' })
    .set('.section-history__text .p--1', { autoAlpha: 0 }, '<50%')
    .set('.section-history__text .p--2', { autoAlpha: 1 }, '<50%');

  $('.ipad, .section-history__text').each((i, elem) => {
    const tween = gsap.fromTo(
      elem,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        paused: true,
        duration: i === 0 ? 0.5 : 1,
        ease: 'power1.inOut',
        clearProps: 'all',
      }
    );
    ScrollTrigger.create({
      trigger: elem,
      start: i === 0 ? 'center bottom' : 'bottom bottom',
      onEnter: () => tween.play(),
      onLeaveBack: () => tween.reverse(),
    });
  });

  /**
   * section-about__horizontal01.js
   */
  ScrollTrigger.create({
    trigger: '.section-about .horizontal01',
    toggleClass: 'in',
  });

  /**
   * section-about.js
   */
  const toggleClass = () => {
    $('.section-about .horizontal02 > *').each((i, target) =>
      $(target).toggleClass('opa')
    );
  };

  const aboutSecTl = gsap
    .timeline({
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top top',
        end: '+=4000',
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onEnter: toggleClass,
        onLeaveBack: toggleClass,
        toggleClass: { targets: '.section-about .symbol', className: 'in' },
      },
    })
    .to('.section-about .horizontal02', {
      keyframes: {
        '0%': { clipPath: () => `circle(7vw at 85vw 25vh)` },
        '5%': { clipPath: () => `circle(7.5vw at 85vw 25vh)` },
        '100%': {
          clipPath: () =>
            `circle(${Math.sqrt(
              (innerWidth * 0.85) ** 2 + (innerHeight * 0.75) ** 2
            )}px at 85vw 25vh)`,
        },
      },
      duration: 0.3,
    })
    .to('.section-about .absolute', {
      id: 'aboutSecTween',
      keyframes: {
        '0%': { x: 0 },
        '60%': {
          x: () => -($('.section-about .absolute').outerWidth() - innerWidth),
        },
        ease: 'none',
      },
    });

  ScrollTrigger.create({
    trigger: '.section-about .horizontal03__text',
    containerAnimation: aboutSecTl,
    start: 'left 80%',
    onEnter: () =>
      gsap.set('.section-about .horizontal03__text .rotate-wrapper span', {
        animationPlayState: 'running',
      }),
  });

  const cardHeight = $('.section-about .horizontal03 .card').outerHeight();

  const cardTlDuration = 1.5;

  const cardTl = gsap.timeline({
    defaults: {
      ease: 'elastic.out(1,1)',
      duration: cardTlDuration,
      yoyo: true,
      yoyoEase: true,
      repeat: 1,
    },
    paused: true,
  });

  const cardSettings = [
    {
      y: { from: cardHeight, to: '-10vh' },
      rotation: { from: -15, to: -15 },
    },
    {
      y: { from: cardHeight, to: '-3vh' },
      rotation: { from: -20, to: 20 },
    },
    {
      y: { from: '-90vh', to: '-26vh' },
      rotation: { from: -10, to: -10 },
    },
    {
      y: { from: '-16vh', to: '-16vh' },
      rotation: { from: -10, to: 17 },
      xPercent: { from: 95, to: 0 },
    },
  ];

  cardSettings.forEach((obj, i) => {
    const from = {};
    const to = {};
    for (const prop in obj) {
      from[`${prop}`] = obj[`${prop}`].from;
      to[`${prop}`] = obj[`${prop}`].to;
    }
    cardTl.fromTo(
      gsap.utils.toArray('.section-about .horizontal03 .card')[i],
      from,
      to,
      0
    );
  });

  ScrollTrigger.create({
    trigger: '.section-about .horizontal03 .card',
    containerAnimation: gsap.getById('aboutSecTween'),
    start: '0% 80%',
    onEnter() {
      cardTl.tweenFromTo(0, cardTlDuration);
    },
    onLeaveBack() {
      cardTl.tweenFromTo(cardTlDuration, cardTlDuration * 2);
    },
  });

  /**
   * section-card.js
   */
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.section-card',
        end: '+=1500',
        pin: true,
        scrub: 0,
      },
    })
    .fromTo(
      '.section-card__inner',
      {
        xPercent: 10,
        yPercent: 20,
        rotation: 5,
        scale: 0.85,
        borderRadius: 10,
      },
      {
        keyframes: {
          '90%': {
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            scale: 1,
            borderRadius: 0,
          },
        },
        ease: 'none',
        duration: 0.7,
      }
    )
    .to('.section-card__videoBox', {
      opacity: 0.1,
      ease: 'none',
      duration: 0.3,
    });

  /**
   * section-weDo.js
   */

  // sticky text
  splitTextIntoSpan('.section-weDo__sticky .row');

  const stickyTextTween = gsap.fromTo(
    '.section-weDo__sticky span',
    { opacity: 0, xPercent: 50, display: 'inline-block' },
    { opacity: 1, xPercent: 0, duration: 0.5, stagger: 0.02, paused: true }
  );

  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) stickyTextTween.play();
        else stickyTextTween.reverse();
      });
    },
    { threshold: 1 }
  ).observe(document.querySelector('.section-weDo__sticky'));

  // card hover
  gsap.set('.card__hover', {
    backgroundImage: (i) =>
      `url(src/image/img_about_wedo_0${i + 1}_hover.webp)`,
  });

  /**
   * section-earth.js
   */

  // random text
  splitTextIntoSpan('.section-earth__text--big .text-wrap');

  const randomTextTween = gsap.fromTo(
    '.section-earth__text--big span',
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      stagger: { each: 0.05, from: 'random' },
      paused: true,
    }
  );

  ScrollTrigger.create({
    trigger: '.section-earth',
    start: 'top 70%',
    onEnter: () => randomTextTween.play(),
  });

  // talk part animation
  const $talk = document.querySelector('.section-earth__talk');
  const $talkBg = document.querySelector('.section-earth__talk .bg');

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: $talk,
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      '.section-earth__talk .bg',
      { y: () => $talk.offsetHeight * 0.5 },
      {
        y: () => -($talkBg.offsetHeight - $talk.offsetHeight),
      }
    )
    .fromTo(
      '.section-earth__talk .finger-emoji > *',
      { x: (i) => (i == 0 ? '-5vw' : '5vw') },
      { x: 0 },
      0
    );

  const handleResize = () => {
    /* year overlap */
    $introSec.style.marginBottom =
      -($introSec.offsetHeight - innerHeight || 0) + 'px';
  };

  window.addEventListener('resize', handleResize);

  /* rotate-text */
  ScrollTrigger.batch('.rotate-point', {
    start: 'bottom bottom',
    onEnter: (batch) => batch.forEach((el) => el.classList.add('in')),
    once: true,
  });
});
