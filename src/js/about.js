// https://appknot.com/
import '../css/about.scss';

import splitTextIntoSpan from './utils/splitTextIntoSpan.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import _ from 'lodash';

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { each } from 'jquery';

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  new Header(document.querySelector('.header'));
  new Footer(document.querySelector('.footer'));

  /**
   * section-history.js
   */

  // year overlap
  const $introSec = document.querySelector('.section-intro');

  $introSec.style.marginBottom =
    -($introSec.offsetHeight - innerHeight || 0) + 'px';

  // ipad animation
  ScrollTrigger.create({
    trigger: '.section-history__contents-inner',
    start: '5% bottom',
    endTrigger: '.section-history',
    end: 'bottom bottom',
    onUpdate({ progress }) {
      if (Math.floor(progress * 10) / 10 === 0.2)
        historyTl.tweenTo('screen-on');
      else if (Math.floor(progress * 10) / 10 === 0.4)
        historyTl.tweenTo('text-on');
      else if (Math.floor(progress * 10) / 10 === 0.6)
        historyTl.tweenTo('screen-change');
      else if (Math.floor(progress * 10) / 10 === 0.8)
        historyTl.tweenTo(historyTl.duration());
    },
  });

  const historyTl = gsap.timeline({
    defaults: { ease: 'power1.inOut' },
    paused: true,
  });
  historyTl
    .addLabel('screen-on')
    .fromTo('.ipad__screen', { autoAlpha: 0 }, { autoAlpha: 1 })
    .addLabel('text-on')
    .fromTo('.section-history__text', { autoAlpha: 0 }, { autoAlpha: 1 })
    .addLabel('screen-change')
    .to('.ipad__screen img', { xPercent: -100, duration: 0.7 })
    .set('.section-history__text .p--1', { autoAlpha: 0 }, '<50%')
    .set('.section-history__text .p--2', { autoAlpha: 1 }, '<50%');

  /**
   * section-about__horizontal01.js
   */

  // img infinite animation
  const imgTween = gsap.to('.section-about .horizontal01__imgContainer img', {
    yPercent: 10,
    stagger: { each: 0.3, repeat: -1, yoyo: true },
    duration: 2,
    ease: 'none',
    paused: true,
  });

  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) imgTween.play();
      else imgTween.pause();
    });
  }).observe(document.querySelector('.section-about .horizontal01'));

  /**
   * section-about__horizontal02.js
   */

  // symbol infinite animation
  const symbolTween = gsap.to('.section-about .horizontal02 .symbol', {
    yPercent: 15,
    rotation: 3,
    stagger: { each: 0.5, repeat: -1, yoyo: true },
    duration: 2,
    ease: 'none',
    paused: true,
  });

  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) symbolTween.play();
      else symbolTween.pause();
    });
  }).observe(document.querySelector('.section-about .horizontal02'));

  /**
   * section-about.js
   */

  const opaTargets = document.querySelectorAll(
    '.section-about .horizontal02 > *'
  );
  const toggleClass = () => {
    opaTargets.forEach((target) => target.classList.toggle('opa'));
  };

  let clipPathX = window.innerWidth * 0.85;
  let clipPathY = window.innerHeight * 0.75;
  let clipPathDiagnal = Math.sqrt(
    clipPathX * clipPathX + clipPathY * clipPathY
  );

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
        onRefresh() {
          clipPathX = window.innerWidth * 0.85;
          clipPathY = window.innerHeight * 0.75;
          clipPathDiagnal = Math.sqrt(
            clipPathX * clipPathX + clipPathY * clipPathY
          );
        },
      },
    })
    .to('.section-about .horizontal02', {
      keyframes: {
        '0%': { clipPath: () => `circle(7vw at 85vw 25vh)` },
        '5%': { clipPath: () => `circle(7.5vw at 85vw 25vh)` },
        '100%': {
          clipPath: () => `circle(${clipPathDiagnal}px at 85vw 25vh)`,
        },
      },
      duration: 0.3,
    })
    .to('.section-about .absolute', {
      id: 'aboutSecTween',
      keyframes: {
        '0%': { x: 0 },
        '60%': {
          x: () =>
            -(
              document.querySelector('.section-about .absolute').offsetWidth -
              innerWidth
            ),
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

  const cardArr = gsap.utils.toArray('.section-about .horizontal03 .card');
  const cardHeight = cardArr[0].offsetHeight;
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

  cardTl
    .fromTo(
      cardArr[0],
      { y: cardHeight, rotation: -15 },
      {
        y: '-10vh',
        rotation: -15,
      }
    )
    .fromTo(
      cardArr[1],
      { y: cardHeight, rotation: -20 },
      { y: '-3vh', rotation: 20 },
      0
    )
    .fromTo(
      cardArr[2],
      { y: '-90vh', rotation: -10 },
      { y: '-26vh', rotation: -10 },
      0
    )
    .fromTo(
      cardArr[3],
      { y: '-16vh', xPercent: 95, rotation: -10 },
      {
        y: '-16vh',
        xPercent: 0,
        rotation: 17,
      },
      0
    );

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
        start: 'top top',
        end: '+=1000',
        pin: true,
        scrub: 1,
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
          '10%': {
            xPercent: 10,
            yPercent: 20,
            rotation: 5,
            scale: 0.85,
            borderRadius: 10,
          },
          '90%': {
            xPercent: 0,
            yPercent: 0,
            rotation: 0,
            scale: 1,
            borderRadius: 0,
          },
        },
      }
    )
    .to('.section-card__videoBox', {
      opacity: 0.3,
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
    onEnter() {
      randomTextTween.play();
    },
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
      '.section-earth__talk .finger-emoji .right',
      { x: '-5vw' },
      { x: 0 },
      0
    )
    .fromTo(
      '.section-earth__talk .finger-emoji .left',
      { x: '5vw' },
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
  });
});
