import Component from "./Component.js";

import gsap from "gsap";

export default class Line extends Component {
  constructor(elem) {
    super(elem, false);
    this.$container = this.elem.parentNode;
    this.isShown = false;
    this.addEvent();
  }
  addEvent() {
    this.$container.addEventListener("mouseover", (e) =>
      this.elem.classList.add("in")
    );
    this.$container.addEventListener("mousemove", (e) => this.drawLine(e));
    this.$container.addEventListener("mouseout", () =>
      this.elem.classList.remove("in")
    );
  }

  drawLine(e) {
    this.registerGSAP();

    const containerY_vw = this.$container.getBoundingClientRect().top;

    gsap
      .timeline()
      .to(".line--horizontal", { x: e.clientX, ease: "none", duration: 0 })
      .to(
        ".line--vertical",
        { y: e.clientY - containerY_vw, ease: "none", duration: 0 },
        0
      );
  }
}
