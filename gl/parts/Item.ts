import * as THREE from "three";
import vertex from "../glsl/item.vert";
import fragment from "../glsl/item.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { Func } from "../core/func";
import { Param } from "../core/param";
import global from "@/utils/globalState";
import { imageDatas } from "@/pages";
import { AssetManager } from "../webgl/assetsManager";

export class Images {
  constructor(container: THREE.Object3D) {
    imageDatas.forEach((_, index) => {
      const item = new Item(`.image${index + 1}`, index);
      global.images.push(item);
      container.add(item);
    });
  }
}

export class Item extends MyObject3D {
  private _width = 0;
  private _height = 0;
  private _material: THREE.ShaderMaterial;
  private _mesh: THREE.Mesh;
  private _selector: string;
  private _needUpdate = true;

  constructor(selector: string, index: number) {
    super();

    this._selector = selector;
    const geometry = new THREE.PlaneGeometry(1, 1);
    this._material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: Update.instance.elapsed },
        u_texture: { value: null },
        u_mask: { value: null },
        u_resolution: {
          value: new THREE.Vector4(1, 1, 1, 1),
        },
        u_progress: {
          value: 0,
        },
        u_imageResolution: {
          value: new THREE.Vector2(1280, 530),
        },
      },
      transparent: true,
    });

    AssetManager.instance.addEventListener("cancelLoading", () => {
      this._material.uniforms.u_texture.value = AssetManager.instance.getTex(
        `image${index + 1}`
      ).value;
      this._material.uniforms.u_mask.value = AssetManager.instance.getTex(
        `mask${index + 1}`
      ).value;
    });

    this._mesh = new THREE.Mesh(geometry, this._material);
    this.add(this._mesh);
    this._updateWidthHeight();
    this._resize();
  }

  private _updateWidthHeight() {
    const dom = document.querySelector(this._selector);
    if (!dom) return;
    const { width, height, x, y } = dom.getBoundingClientRect();

    const posX = -Func.instance.sw() / 2 + width / 2 + x;
    const posY = Func.instance.sh() / 2 - height / 2 - y;
    this._width = width;
    this._height = height;
    this.position.set(posX, posY, 0.01);
    this._mesh.scale.set(width * 2.51, height * 2.51, 1);
  }

  private _updateResolution() {
    const { width, height, a1, a2 } = getResolution(
      this._width,
      this._height,
      530,
      1280
    );
    this._material.uniforms.u_resolution.value.set(width, height, a1, a2);
  }

  protected _update(): void {
    super._update();

    if (this._needUpdate) {
      this._updateWidthHeight();
    }

    this._updateResolution();
    this._material.uniforms.u_time.value = Update.instance.elapsed;
    this._material.uniforms.u_progress.value =
      Param.instance.main.progress.value;
  }

  protected _resize(): void {
    super._resize();
  }

  public changeSeletor(seletor: string) {
    this._selector = seletor;
  }

  public hide() {
    this.scale.setScalar(0);
  }
  public show() {
    this.scale.setScalar(1);
  }
  public needUpdateTrue() {
    this._needUpdate = true;
  }
  public needUpdateFalse() {
    this._needUpdate = false;
  }
  public scroll(scroll: number) {
    const offset = Func.instance.sw() > 800 ? 150 : 0;
    this.position.y = scroll - offset;
  }
}

function getResolution(
  elementWidth: number,
  elementHeight: number,
  imageHeight: number,
  imageWidth: number
) {
  const imageAspect = imageHeight / imageWidth;
  const width = elementWidth;
  const height = elementHeight;
  let a1, a2;
  if (height / width > imageAspect) {
    a1 = (width / height) * imageAspect;
    a2 = 1;
  } else {
    a1 = 1;
    a2 = height / width / imageAspect;
  }

  return { width, height, a1, a2 };
}
