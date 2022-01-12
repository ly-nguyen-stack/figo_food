import Util from '../util';
/*
特定の要素内でSticky
data-offsetでheader分を考慮したり出来る。


① 基本形
this.sticky = new StickyElem();

② SPの時は解除する例
if (!Util.IS_SP) this.sticky = new StickyElem();
Util.Dispatcher.addEventListener('DeviceChange', ()=>{
  if (Util.IS_SP) {
    if (this.sticky) {
      this.sticky.purge();
      this.sticky = null;
    }
  } else {
    if (!this.sticky) {
      this.sticky = new StickyElem();
    }
  }
});


// ______________________________________________________________
【pug】
.sticky__wrapper(data-offset="0")
  .sticky__elem


// ______________________________________________________________
【css】
.sticky {
  &__wrapper {
    width: 800px;
    position: relative;
  }

  &__elem {
    position: absolute;
    top: 0;
    right: 0;

    &.fix {
      position: fixed;

      ✅ここは工夫して。
      %でもいいんですが800pxのとこにwrapperの幅が入ります。
      right: calc((100% - 800px) / 2);
    }

    &.bottom {
      bottom: 0;
      top: auto;
    }
  }
}
*/

export default class StickyElem {
  private nodes: StickyElemNode[] = [];

  constructor() {
    const wrapper: HTMLElement[] = Array.prototype.slice.call(document.getElementsByClassName('sticky__wrapper'));
    for (const elem of wrapper) {
      const node = new StickyElemNode(elem);
      this.nodes.push(node);
    }
  }

  private purge = (): void => {
    for (const node of this.nodes) {
      node.purge();
    }
  };
}

class StickyElemNode {
  private parent: HTMLElement | null;
  private targets: HTMLElement[] | null;
  private isSticky: boolean = false;
  private isBottomFix: boolean = false;

  constructor(wrapper: HTMLElement) {
    this.parent = wrapper;
    this.targets = Array.prototype.slice.call(wrapper.getElementsByClassName('sticky__elem'));

    window.addEventListener('scroll', this.onScroll, Util.isPassive);
    this.onScroll();
  }

  private onScroll = (): void => {
    if (!this.parent) {
      Util.warn('sticky-elem.ts: no parents');
      return;
    }
    if (!this.targets) {
      Util.warn('sticky-elem.ts: no targets');
      return;
    }

    const parentRect: ClientRect = this.parent.getBoundingClientRect();

    for (const target of this.targets) {
      const targetRect: ClientRect = target.getBoundingClientRect();
      const offsetY: number = Number(this.parent.dataset.offset);

      if (targetRect.top + targetRect.height >= parentRect.top + parentRect.height) {
        this.isBottomFix = true;
        target.classList.remove('fix');
        target.removeAttribute('style');
        target.classList.add('bottom');
      } else if (targetRect.top <= offsetY) {
        this.isSticky = true;
        target.classList.add('fix');
      }

      if (this.isBottomFix) {
        if (parentRect.top + parentRect.height - offsetY > targetRect.height) {
          this.isBottomFix = false;
          this.isSticky = true;
          target.classList.remove('bottom');
          target.removeAttribute('style');
        }
      }

      if (this.isSticky) {
        if (parentRect.top >= offsetY) {
          this.isSticky = false;
          target.classList.remove('fix');
          target.removeAttribute('style');
        } else if (!this.isBottomFix) {
          target.classList.add('fix');
          target.style.top = `${offsetY}px`;
        }
      }
    }
  };

  public purge = (): void => {
    window.removeEventListener('scroll', this.onScroll);

    if (this.targets) {
      for (const target of this.targets) {
        target.classList.remove('bottom');
        target.classList.remove('fix');
        target.removeAttribute('style');
      }
    }

    this.targets = null;
    this.parent = null;
  };
}
