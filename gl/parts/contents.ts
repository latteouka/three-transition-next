import { MyDisplay } from "../core/myDisplay";
import { AssetManager } from "../webgl/assetsManager";
import { Visual } from "./visual";

export class Contents extends MyDisplay {
  constructor(opt: any) {
    super(opt);

    AssetManager.instance.load({
      assets: [
        { name: "image1", path: "/img/1.webp", type: "tex", timing: "must" },
        { name: "image2", path: "/img/2.webp", type: "tex", timing: "must" },
        { name: "image3", path: "/img/3.webp", type: "tex", timing: "must" },
        { name: "image4", path: "/img/4.webp", type: "tex", timing: "must" },
        { name: "image5", path: "/img/5.webp", type: "tex", timing: "must" },
        { name: "mask1", path: "/img/mask8.png", type: "tex", timing: "must" },
        { name: "mask2", path: "/img/mask2.webp", type: "tex", timing: "must" },
        { name: "mask3", path: "/img/mask3.webp", type: "tex", timing: "must" },
        { name: "mask4", path: "/img/mask4.webp", type: "tex", timing: "must" },
        { name: "mask5", path: "/img/mask5.webp", type: "tex", timing: "must" },
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
