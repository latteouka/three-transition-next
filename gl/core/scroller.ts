import Lenis from "@studio-freight/lenis";
import { Update } from "../libs/update";

export class Scroller {
  public lenis: Lenis;
  private static _instance: Scroller;

  private _updateHandler: any;

  public static get instance(): Scroller {
    if (!this._instance) {
      this._instance = new Scroller();
    }
    return this._instance;
  }

  constructor() {
    this._updateHandler = this._update.bind(this);
    Update.instance.add(this._updateHandler);

    const lenis = new Lenis({
      duration: 1,
      easing: (t: any) => {
        const c4 = (2 * Math.PI) / 3;

        return t === 0
          ? 0
          : t === 1
          ? 1
          : Math.pow(2, -10 * t) * Math.sin((t * 12 - 0.75) * c4) + 1;
      },
      infinite: true,
      smoothTouch: true,
    });

    this.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  private _update(): void {}
}
