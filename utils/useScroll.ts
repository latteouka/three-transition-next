import { Func } from "@/gl/core/func";
import Lenis from "@studio-freight/lenis";
import { useRef } from "react";
import { gsap } from "gsap";
import { useIsomorphicLayoutEffect } from "react-use";
import global from "./globalState";
import { Util } from "@/gl/libs/util";

const useScroll = () => {
  let moving = useRef(false);
  const reqIdRef = useRef<ReturnType<typeof requestAnimationFrame>>();

  useIsomorphicLayoutEffect(() => {
    const images = document.querySelectorAll(
      ".image"
    )! as NodeListOf<HTMLDivElement>;
    const wraps = document.querySelectorAll(
      ".wrap"
    )! as NodeListOf<HTMLDivElement>;
    const links = document.querySelectorAll(
      ".image-link"
    )! as NodeListOf<HTMLDivElement>;

    const triggerVelocity = Func.instance.sw() > 600 ? 50 : 20;

    // init lenis
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0
          ? 0
          : t === 1
          ? 1
          : Math.pow(2, -10 * t) * Math.sin((t * 12 - 0.75) * c4) + 1;
      },
      touchMultiplier: 2.5,
      infinite: true,
      smoothTouch: true,
    });

    // lenis raf
    const animate = (time: DOMHighResTimeStamp) => {
      lenis.raf(time);
      reqIdRef.current = requestAnimationFrame(animate);
    };
    reqIdRef.current = requestAnimationFrame(animate);

    global.lenis = lenis;

    // main scroll animation logic is here
    function onScroll({ velocity }: Lenis) {
      console.log(velocity);
      // low velocity
      if (velocity < triggerVelocity && velocity > -triggerVelocity) {
        if (moving.current) return;
        gsap.to(images[global.activeIndex], {
          x: velocity * 8,
          y: -velocity * 8,
        });
      } else {
        // trigger animation
        if (moving.current) return;

        const isNext = velocity > 0;
        const pre = global.activeIndex;
        global.activeIndex = isNext ? getNext() : getPre();

        document.documentElement.style.setProperty(
          "--fontColor",
          theme[global.activeIndex].color
        );
        // prevent clicking other link
        links.forEach((link) => {
          link.style.pointerEvents = "none";
        });

        const titleNow = wraps[pre].querySelector(
          ".mainTitle"
        )! as HTMLDivElement;
        const titleNext = wraps[global.activeIndex].querySelector(
          ".mainTitle"
        )! as HTMLDivElement;

        const subtitleNow = wraps[pre].querySelector(
          ".subtitle"
        )! as HTMLDivElement;
        const subtitleNext = wraps[global.activeIndex].querySelector(
          ".subtitle"
        )! as HTMLDivElement;

        // 換顏色
        gsap.to(".container", {
          backgroundColor: theme[global.activeIndex].background,
          duration: 1,
        });

        // hide titles now
        gsap.set(titleNow, {
          opacity: 0,
        });
        gsap.set(subtitleNow, {
          opacity: 0,
        });

        // move image top-right
        gsap.to(images[pre], {
          x: isNext ? distance : -distance,
          y: isNext ? -distance : distance,
        });
        // move image from bottom-left to 0,0
        gsap.fromTo(
          images[global.activeIndex],
          {
            x: isNext ? -distance : distance,
            y: isNext ? distance : -distance,
          },
          {
            x: 0,
            y: 0,
            ease: "back",
            onStart: () => {
              moving.current = true;
              // setActive(isNext ? getNext() : getPre());
            },
            onComplete: () => {
              moving.current = false;
            },
          }
        );
        gsap.fromTo(
          titleNext,
          { opacity: 0, x: isNext ? -100 : 100 },
          {
            opacity: 1,
            x: 0,
            delay: 0.5,
          }
        );
        gsap.fromTo(
          subtitleNext,
          { opacity: 0, x: isNext ? -100 : 100 },
          {
            opacity: 1,
            x: 0,
            delay: 0.8,
            onComplete: () => {
              links.forEach((link) => {
                link.style.pointerEvents = "auto";
              });

              // tell index to overwrite outro animations
              Util.instance.ev("setupAnimation", {});
            },
          }
        );
      }
    }

    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
      lenis.destroy();
      cancelAnimationFrame(reqIdRef.current as number);
    };
  }, []);
};
export default useScroll;

function getNext() {
  return global.activeIndex + 1 < max ? global.activeIndex + 1 : 0;
}
function getPre() {
  return global.activeIndex - 1 >= 0 ? global.activeIndex - 1 : max - 1;
}

const max = 5;
const distance = 1300;
export const theme = [
  {
    background: "#e7e0d8",
    color: "#ab4f43",
  },
  {
    background: "#bfca8c",
    color: "#050402",
  },
  {
    background: "#cac6c3",
    color: "#243702",
  },
  {
    background: "#f7f7ef",
    color: "#ad9370",
  },
  {
    background: "#a8a7b4",
    color: "#d24407",
  },
];
