import { Cache } from "three";
import { Func } from "../core/func";
import { Canvas } from "../webgl/canvas";
import { Object3D } from "three/src/core/Object3D";
import { Update } from "../libs/update";
import { Images } from "./Item";
import { Brush } from "./Brush";
import global from "@/utils/globalState";

Cache.enabled = true;

export class Visual extends Canvas {
  private _brush: Brush;
  private _con: Object3D;

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    new Images(this._con);

    this._brush = new Brush();

    this._resize();
  }

  protected _update(): void {
    super._update();

    if (this.isNowRenderFrame()) {
      this._render();
    }
  }

  private _render(): void {
    this.renderer.setClearColor("#fff", 0);
    this.renderer.setRenderTarget(this._brush.brushTexture);
    this.renderer.render(this._brush.scene, this.cameraPers);
    global.images.forEach((image) => {
      image.material.uniforms.u_brush.value = this._brush.brushTexture.texture;
    });
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.mainScene, this.cameraPers);
  }

  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0;
  }

  _resize(): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 90;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
