import Component from './Component.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export default class Header extends Component {
  template() {
    return `
       <div class="header__nav header__nav--wide">
        <nav class="nav">
          <ul class="nav__list">
            <li><a href="#">solution</a></li>
            <li><a href="#">about</a></li>
            <li><a href="#">work</a></li>
            <li><a href="#">contact</a></li>
          </ul>
        </nav>
      </div>
      <div class="header__logo">
        <div class="logo">appknot</div>
      </div>
      <div class="header__nav header__nav--narrow">
        <nav class="nav">
          <div class="nav__bg"></div>
          <ul class="nav__list">
            <li><a href="#">solution</a></li>
            <li><a href="#">about</a></li>
            <li><a href="#">work</a></li>
            <li><a href="#">contact</a></li>
          </ul>
        </nav>
      </div>
      <div class="header__copyright">
        <p class="copyright">copyright &copy; 2023 appknot</p>
      </div>
    `;
  }

  addEvent() {
    this.executeGSAP();
  }

  executeGSAP() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const headerTl = gsap
      .timeline({
        scrollTrigger: {
          trigger: '.header',
          start: 'center top',
          onLeaveBack() {
            headerTl.reverse();
          },
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
  }
}
