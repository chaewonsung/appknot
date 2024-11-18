import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import $ from 'jquery';

import splitTextIntoSpan from './utils/splitTextIntoSpan';

gsap.registerPlugin(ScrollTrigger);

/* Components */
$('.header-include').load('src/js/includes/header.html', () => {
  let isHeaderAnimated = false;
  addEventListener('scroll', () => {
    if (scrollY && !isHeaderAnimated) {
      headerTl.play();
      isHeaderAnimated = true;
    }
    if (!scrollY) {
      headerTl.reverse();
      isHeaderAnimated = false;
    }
  });

  const headerTl = gsap
    .timeline({
      paused: true,
      scrollTrigger: {
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      '.header__nav--wide',
      { display: 'block', width: () => '100%' },
      {
        width: 'auto',
        yPercent: -70,
        opacity: 0,
        ease: 'power3.in',
      }
    )
    .addLabel('narrow-nav')
    .fromTo(
      '.header__nav--narrow .nav__bg',
      { yPercent: -70, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: 'circ', duration: 0.3 },
      'narrow-nav-=0.1'
    )
    .fromTo(
      '.header__nav--narrow .nav__list',
      { yPercent: 70, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.3 },
      'narrow-nav-=0.1'
    )
    .fromTo(
      '.header__logo, .header__copyright',
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1 },
      'narrow-nav-=0.1'
    );
});
$('.footer-include').load('src/js/includes/footer.html');
$('.contact-modal-include').load(
  'src/js/includes/contact-modal.html',
  function () {
    const spanTween = gsap
      .timeline({
        onStart: () => {
          const now = new Date();
          const h = now.getHours().toString().padStart(2, '0');
          const m = now.getMinutes().toString().padStart(2, '0');
          $('.contact-modal .sender .time').text(`${h}:${m}`);
        },
      })
      .fromTo(
        splitTextIntoSpan('.contact-modal .split'),
        { opacity: 0, display: 'inline-block' },
        { opacity: 1, stagger: 0.07, duration: 0 }
      )
      .fromTo(
        '.contact-modal .sender, .contact-modal ul',
        {
          opacity: 0,
          y: 50,
        },
        { opacity: 1, y: 0, stagger: 0.3 },
        '<0.3'
      )
      .progress(1);
    $('.contact-badge').on('click', function () {
      $('.contact-modal').toggleClass('show');
      $('.contact-modal').hasClass('show') && spanTween.restart();
    });
    $('section').on('click', function () {
      $('.contact-modal').hasClass('show') &&
        $('.contact-modal').removeClass('show');
    });

    ScrollTrigger.addEventListener('scrollStart', () => {
      $('.contact-badge').addClass('scroll');
    });
    ScrollTrigger.addEventListener('scrollEnd', () => {
      $('.contact-badge').removeClass('scroll');
    });

    const reference = $(
      '.contact-modal-container .img-box'
    )[0].getBoundingClientRect();

    $('.container')[0].addEventListener('mousemove', function (e) {
      const deg =
        (Math.atan2(-(e.clientX - reference.left), reference.top - e.clientY) *
          180) /
        Math.PI;

      $('.contact-modal-container .img-box').css({
        rotate: `-${deg + (deg > 0 ? 0 : 360)}deg`,
      });
    });
  }
);

$('.line')[0] &&
  $('.line')
    .parent()
    .on({
      mouseenter: () => $('.line').addClass('in'),
      mousemove: function ({ originalEvent: e }) {
        gsap.set('.line--horizontal', { x: e.clientX });
        gsap.set('.line--vertical', {
          y: e.clientY - $(this)[0].getBoundingClientRect().top,
        });
      },
      mouseleave: () => $('.line').removeClass('in'),
    });

/* rotate-text */
gsap.utils.toArray('.rotate-point').forEach((item) => {
  ScrollTrigger.create({
    trigger: item,
    start: 'top 50%',
    onEnter: (self) => self.trigger.classList.add('in'),
    once: true,
  });
});
