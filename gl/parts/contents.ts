import { MyDisplay } from "../core/myDisplay";
import { AssetManager } from "../webgl/assetsManager";
import { Visual } from "./visual";

export class Contents extends MyDisplay {
  constructor(opt: any) {
    super(opt);

    AssetManager.instance.load({
      assets: [
        { name: "image1", path: "/img/1.jpg", type: "tex", timing: "must" },
        { name: "image2", path: "/img/2.jpg", type: "tex", timing: "must" },
        { name: "image3", path: "/img/3.jpg", type: "tex", timing: "must" },
        { name: "image4", path: "/img/4.jpg", type: "tex", timing: "must" },
        { name: "image5", path: "/img/5.jpg", type: "tex", timing: "must" },
        { name: "mask1", path: "/img/mask1.jpeg", type: "tex", timing: "must" },
        { name: "mask2", path: "/img/mask2.jpeg", type: "tex", timing: "must" },
        { name: "mask3", path: "/img/mask3.jpeg", type: "tex", timing: "must" },
        { name: "mask4", path: "/img/mask4.jpeg", type: "tex", timing: "must" },
        { name: "mask5", path: "/img/mask5.jpeg", type: "tex", timing: "must" },
      ],
    });

    AssetManager.instance.addEventListener("loadMustAssets", () => {
      new Visual({
        el: document.querySelector(".l-canvas"),
        transparent: true,
      });
    });
  }

  protected _update(): void {
    super._update();
  }

  protected _resize(): void {
    super._resize();
  }
}
