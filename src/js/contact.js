import '../css/contact.scss';
import toPX from './utils/toPX.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import $ from 'jquery';
import { transform } from 'lodash';

window.onload = function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  ScrollTrigger.create({
    trigger: '.section-intro__text',
    endTrigger: '.section-intro__text .en',
    toggleClass: {
      targets: '.section-intro',
      className: 'active',
    },
  });

  ScrollTrigger.create({
    trigger: '.section-horizText__text .big-text',
    end: '99999',
    toggleClass: { targets: '.section-horizText__text', className: 'active' },
  });
  const horizTextSecTween = gsap.fromTo(
    '.section-horizText__text .big-text',
    { x: 0 },
    {
      x: -(
        $('.section-horizText__text .big-text').outerWidth() -
        document.body.clientWidth
      ),
      paused: true,
    }
  );
  ScrollTrigger.create({
    trigger: '.section-horizText',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: ({ progress }) =>
      gsap.to(horizTextSecTween, {
        progress,
        ease: 'power2.inOut',
        overwrite: true,
      }),
    onRefresh: () => {
      horizTextSecTween.invalidate();
      horizTextSecTween.vars.x = -(
        $('.section-horizText__text .big-text').outerWidth() -
        document.body.clientWidth
      );
    },
  });

  ScrollTrigger.create({
    trigger: '.section-member__text',
    start: 'top center',
    onEnter: () => $('.section-member__text .tag').addClass('active'),
    once: true,
  });
  ScrollTrigger.create({
    trigger: '.section-member__text',
    start: 'top 85%',
    end: '+=9999',
    toggleClass: {
      targets: '.section-member__bg',
      className: 'active',
    },
    onEnter: () => $('.container').removeClass('header-on'),
    onLeaveBack: () => $('.container').addClass('header-on'),
  });

  const memberSecImgTween = gsap.fromTo(
    '.section-member__imgWrapper',
    { width: toPX('40vw') },
    {
      width: $('.section-member__imgWrapper img').outerWidth(),
      paused: true,
    }
  );

  ScrollTrigger.create({
    trigger: '.section-member__imgWrapper',
    end: 'top top',
    onUpdate: ({ progress }) =>
      gsap.to(memberSecImgTween, {
        progress,
        ease: 'power1.inOut',
        overwrite: true,
      }),
    onRefresh: () => {
      memberSecImgTween.invalidate();
      memberSecImgTween.vars.startAt.width = toPX('40vw');
      memberSecImgTween.vars.width = $(
        '.section-member__imgWrapper img'
      ).outerWidth();
    },
  });

  import('./common.js');
};
