import { gsap } from "gsap";
import { Func } from "@/gl/core/func";
import global from "./globalState";
import { Param } from "@/gl/core/param";
import { enableLink } from "./controls";
import { EasePack } from "gsap/dist/EasePack";
gsap.registerPlugin(EasePack);

/*-------------------------------
	Container Color
-------------------------------*/
export function containerBgColor(color: string, onStart: () => void) {
  return gsap.to(".container", {
    backgroundColor: color,
    duration: 1,
    onStart,
  });
}

/*-------------------------------
	Main Title
-------------------------------*/
export function mainTitleHide() {
  const wraps = document.querySelectorAll(`.wrap`);
  const main = wraps[global.activeIndex].querySelector(".mainTitle")!;
  return gsap.to(main, {
    y: -100,
    opacity: 0,
    duration: 1,
  });
}

export function mainTitleShow(delay: number) {
  const wraps = document.querySelectorAll(`.wrap`);
  const main = wraps[global.activeIndex].querySelector(".mainTitle")!;
  return gsap.fromTo(
    main,
    { opacity: 0, x: -100 },
    {
      opacity: 1,
      x: 0,
      delay,
    }
  );
}

/*-------------------------------
	Sub Title
-------------------------------*/
export function subTitleHide() {
  const wraps = document.querySelectorAll(`.wrap`);
  const sub = wraps[global.activeIndex].querySelector(".subtitle")!;
  return gsap.to(sub, {
    y: -100,
    opacity: 0,
    duration: 1,
  });
}

export function subTitleShow(delay: number, onComplete: () => void) {
  const wraps = document.querySelectorAll(`.wrap`);
  const sub = wraps[global.activeIndex].querySelector(".subtitle")!;
  return gsap.fromTo(
    sub,
    { opacity: 0, x: -100 },
    {
      opacity: 1,
      x: 0,
      delay,
      onComplete,
    }
  );
}

/*-------------------------------
	Bottom Nav
-------------------------------*/
export function bottomNavHide() {
  return gsap.to(".bottomNav", {
    y: 100,
    opacity: 0,
    duration: 1,
  });
}

export function bottomNavShow(onStart?: () => void) {
  return gsap.fromTo(
    ".bottomNav",
    {
      y: 100,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
    }
  );
}

/*-------------------------------
	Bottom Link
-------------------------------*/
export function bottomLinkHide() {
  return gsap.to(".bottomLink", {
    y: 100,
    opacity: 0,
    duration: 1,
  });
}

export function bottomLinkShow() {
  return gsap.fromTo(
    ".bottomLink",
    {
      y: 100,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
    }
  );
}

/*-------------------------------
	Image Position
-------------------------------*/
export function imageTranLarge(image: any) {
  return gsap.to(image, {
    x: -Func.instance.sw() * 0.2,
    y: 150,
    ease: "elastic",
    duration: 1.5,
  });
}

export function imageTranSmall(image: any) {
  return gsap.to(image, {
    y: 64,
    ease: "elastic",
    duration: 1.5,
  });
}

/*-------------------------------
	Image Blob Progress
-------------------------------*/
export function progressUp() {
  return gsap.to(Param.instance.main.progress, {
    value: 1.5,
    duration: 1.2,
    ease: "linear",
    onComplete: () => {
      global.lenis!.start();

      enableLink(true);
    },
  });
}

/*-------------------------------
	Grid Animation
-------------------------------*/

export function loadingGrid() {
  const tl = gsap
    .timeline()
    .fromTo(
      ".rotate",
      {
        scale: 0,
        outlineColor: "#fff",
        rotation: 0,
      },
      {
        scale: 1,
        outlineColor: "#e7e0d8",
        rotation: -360,
        duration: 1.5,
        stagger: {
          each: 0.1,
          from: "center",
          grid: "auto",
        },
      }
    )
    .addLabel("complete");

  tl.tweenTo("complete", {
    duration: 2.5,
    ease: EasePack.SlowMo.config(0.3, 0.5, false),
    repeat: -1,
    yoyo: true,
  });
}
