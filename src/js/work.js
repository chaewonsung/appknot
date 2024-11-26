import '../css/work.scss';
import splitTextIntoSpan from './utils/splitTextIntoSpan.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import $ from 'jquery';

window.onload = () => {
  gsap.registerPlugin(ScrollTrigger);

  $(splitTextIntoSpan('h1 .split')).css('display', 'inline-block');
  $('h1 .tag').text($('.section-work__workList li').length);

  gsap
    .timeline({ delay: 0.5 })
    .fromTo(
      'h1 .split span',
      { autoAlpha: 0, yPercent: -100 },
      {
        autoAlpha: 1,
        yPercent: 0,
        stagger: 0.05,
        clearProps: 'all',
      }
    )
    .fromTo('h1', { scale: 1.4 }, { scale: 1, clearProps: 'scale' })
    .to('ul .anim-target', { transform: 'none' }, '<')
    .to(
      '.rotate-point--custom',
      {
        css: { className: (i, el) => `${el.className} in` },
      },
      '<'
    )
    .fromTo('h1 .tag', { scale: 0 }, { scale: 1 });

  gsap.set('.section-work__workList li:not(.anim-target)', {
    opacity: 0,
    yPercent: 100,
  });
  ScrollTrigger.batch('.section-work__workList li:not(.anim-target)', {
    start: 'top-=50% bottom',
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, yPercent: 0, stagger: 0.2 }),
    once: true,
  });

  import('./common.js');
};
