import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/*
.scroll-elemを付けるとパララックス対象になる。
x, y, rotation, alphaをいじれます。

例）
.scroll-elem(data-x="800")
基本形でしかないので必要なパラメータ、イージングなど、テキトウに改造して下さい。
*/
export default class ScrollElements {
  constructor() {
    const elements = Array.prototype.slice.call(document.getElementsByClassName('scroll-elem'));
    for (const elem of elements) {
      new ScrollElement(elem);
    }
  }
}

class ScrollElement {
  constructor(elem: HTMLElement) {
    const x: number = elem.dataset.x ? Number(elem.dataset.x) : 0;
    const y: number = elem.dataset.y ? Number(elem.dataset.y) : 0;
    const rotation: number = elem.dataset.rotation ? Number(elem.dataset.rotation) : 0;
    const alpha: number = elem.dataset.alpha ? Number(elem.dataset.alpha) : 1;

    gsap.to(elem, {
      x,
      y,
      rotation,
      alpha,
      duration: 1,
      scrollTrigger: {
        trigger: elem,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      ease: 'power1.easeInOut'
    });
  }
}
