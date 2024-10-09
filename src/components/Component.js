import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default class Component {
  constructor(elem, shouldAddEvent = true) {
    this.elem = elem;
    this.appendHTML();
    if (shouldAddEvent) this.addEvent();
  }
  template() {
    return "";
  }
  appendHTML() {
    this.elem.innerHTML = this.template();
  }
  addEvent() {}
  registerGSAP() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }
}
