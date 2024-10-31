import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import $ from 'jquery';

new Header($('.header')[0]);
new Footer($('.footer')[0]);

/* rotate-text */
gsap.utils.toArray('.rotate-point').forEach((item) => {
  ScrollTrigger.create({
    trigger: item,
    start: 'top 50%',
    onEnter: (self) => self.trigger.classList.add('in'),
    once: true,
  });
});
