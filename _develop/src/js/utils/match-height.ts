export default class MatchHeight {
  private items: HTMLElement[] = [];
  constructor(el: HTMLElement[]) {
    this.items = el;
    this.init();
  }

  private init = () => {
    if (!this.items || this.items.length === 0) return;
    this.processHeight();
    window.addEventListener('resize', this.processHeight, false);
  };
  private processHeight = (): void => {
    let elmG: number[][] = [];
    this.resetHeight();
    if (this.items.length > 1) {
      elmG = this.createGroup();
      elmG.forEach((elm: number[]) => {
        this.setHeight(elm);
      });
    }
  };

  private createGroup = () => {
    const bodyRect: DOMRect = document.body.getBoundingClientRect();
    const array = [];
    let arrTemp = [0];
    let offsetOrg = this.items[0].getBoundingClientRect().top - bodyRect.top;
    let offsetTemp;
    this.items.forEach((item: HTMLElement, i) => {
      offsetTemp = item.getBoundingClientRect().top - bodyRect.top;
      if (offsetTemp !== offsetOrg) {
        array.push(arrTemp);
        offsetOrg = offsetTemp;
        arrTemp = [i];
      } else {
        arrTemp.push(i);
      }
    });
    array.push(arrTemp);
    return array;
  };

  private setHeight = (arr: number[]) => {
    let maxHeight = this.items[arr[0]].clientHeight;
    if (arr.length > 1) {
      // Get max height
      arr.forEach((el) => {
        maxHeight = Math.max(this.items[el].clientHeight, maxHeight);
      });

      // Set max height
      arr.forEach((el) => {
        this.items[el].style.height = `${maxHeight}px`;
      });
    }
  };

  // Reset height
  private resetHeight = () => {
    this.items.forEach((item: HTMLElement) => {
      item.style.height = '';
    });
  };
}
