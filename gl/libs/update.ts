import * as THREE from "three";

export class Update {
  private static _instance: Update;

  // count and elapsed time
  public cnt: number = 0;
  private _clock: THREE.Clock;
  public elapsed: number = 0;

  // use add function to participate in frame update
  private _updateList: Array<Function> = [];

  public play: boolean = true;

  constructor() {
    this._clock = new THREE.Clock();
    window.requestAnimationFrame(this._update);
  }

  public static get instance(): Update {
    if (!this._instance) {
      this._instance = new Update();
    }
    return this._instance;
  }

  public add(f: Function) {
    this._updateList.push(f);
  }

  public remove(f: Function) {
    const arr: Array<Function> = [];
    this._updateList.forEach((val) => {
      if (val != f) {
        arr.push(val);
      }
    });
    this._updateList = arr;
  }

  _update = () => {
    if (this.play) {
      this.cnt++;
      this.elapsed = this._clock.getElapsedTime();
      for (var item of this._updateList) {
        if (item != null) item();
      }
      window.requestAnimationFrame(this._update);
    }
  };
}
