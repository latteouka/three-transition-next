import { Func } from "@/gl/core/func";
import Lenis from "@studio-freight/lenis";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useIsomorphicLayoutEffect } from "react-use";
import global from "./globalState";

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
    color: "#ba3d02",
  },
];

const useScroll = () => {
  // const [active, setActive] = useState(0);
  let moving = useRef(false);
  const [lenis, setLenis] = useState<Lenis | null>();
  const reqIdRef = useRef<ReturnType<typeof requestAnimationFrame>>();

  function getNext() {
    return global.activeIndex + 1 < max ? global.activeIndex + 1 : 0;
  }
  function getPre() {
    return global.activeIndex - 1 >= 0 ? global.activeIndex - 1 : max - 1;
  }

  useEffect(() => {
    const animate = (time: DOMHighResTimeStamp) => {
      lenis?.raf(time);
      reqIdRef.current = requestAnimationFrame(animate);
    };
    reqIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqIdRef.current as number);
  }, [lenis]);

  useIsomorphicLayoutEffect(() => {
    const images = document.querySelectorAll(
      ".image"
    )! as NodeListOf<HTMLDivElement>;
    const wraps = document.querySelectorAll(
      ".wrap"
    )! as NodeListOf<HTMLDivElement>;

    const triggerVelocity = Func.instance.sw() > 600 ? 50 : 20;

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

    global.lenis = lenis;
    setLenis(lenis);

    function onScroll({ velocity }: Lenis) {
      if (velocity < triggerVelocity && velocity > -triggerVelocity) {
        if (moving.current) return;
        gsap.to(images[global.activeIndex], {
          x: velocity * 3,
          y: -velocity * 3,
        });
      } else {
        if (moving.current) return;

        gsap.defaults({ overwrite: true });
        const isNext = velocity > 0;
        const pre = global.activeIndex;
        global.activeIndex = isNext ? getNext() : getPre();
        // setActive(global.activeIndex);
        // container.style.backgroundColor = theme[getNext()].background;
        // document.documentElement.style.setProperty(
        //   "--backgroundColor",
        //   theme[isNext ? getNext() : getPre()].background
        // );
        document.documentElement.style.setProperty(
          "--fontColor",
          theme[global.activeIndex].color
        );

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
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            delay: 0.5,
          }
        );
        gsap.fromTo(
          subtitleNext,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            delay: 0.8,
          }
        );
      }
    }

    // 最初の位置
    const ctx = gsap.context(() => {
      const now = global.activeIndex;
      // const now = 3;
      images.forEach((image, index) => {
        if (index === now) return;
        gsap.set(image, {
          x: -distance,
          y: distance,
        });
      });
    });
    lenis.on("scroll", onScroll);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  // return active;
};
export default useScroll;
