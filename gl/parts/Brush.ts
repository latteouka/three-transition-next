import * as THREE from "three";
import { MyObject3D } from "../webgl/myObject3D";
import { TexLoader } from "../webgl/texLoader";
import { MousePointer } from "../core/mousePointer";
import { Func } from "../core/func";

/*-------------------------------
* Off screen rendering
-------------------------------*/
export class Brush extends MyObject3D {
  public scene = new THREE.Scene();
  meshes: THREE.Mesh[] = [];
  max = 50;
  currentWave = 0;
  brushTexture = new THREE.WebGLRenderTarget(
    Func.instance.sw(),
    Func.instance.sh(),
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    }
  );

  // brush size
  private _width = Func.instance.sw() > 800 ? 100 : 50;

  constructor() {
    super();

    for (let i = 0; i < this.max; i++) {
      const geometry = new THREE.PlaneGeometry(this._width, this._width);
      const material = new THREE.MeshBasicMaterial({
        map: TexLoader.instance.get("/brush5.png"),
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = Math.PI * 2 * Math.random();
      mesh.visible = false;
      this.meshes.push(mesh);
      this.add(mesh);
    }
    this.scene.add(this);
  }

  private _setNewWave(x: number, y: number, index: number) {
    const mesh = this.meshes[index];
    if (!mesh) return;
    mesh.visible = true;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.scale.setScalar(1);
    const material = mesh.material as THREE.MeshBasicMaterial;
    material.opacity = 1;
  }

  private _trackMousePos() {
    if (MousePointer.instance.dist > 4) {
      this._setNewWave(
        MousePointer.instance.cx,
        -MousePointer.instance.cy,
        this.currentWave
      );
      this.currentWave = (this.currentWave + 1) % this.max;
    }
  }

  protected _update(): void {
    super._update();

    this._trackMousePos();

    this.meshes.forEach((mesh) => {
      const material = mesh.material as THREE.MeshBasicMaterial;

      if (material.opacity < 0.002) {
        mesh.visible = false;
        return;
      }
      mesh.rotation.z += 0.01;
      mesh.scale.setScalar(1.005 * mesh.scale.x + 0.1);
      material.opacity *= 0.94;
    });
  }

  protected _resize() {
    super._resize();

    this._width = Func.instance.sw() > 800 ? 100 : 50;
  }
}
