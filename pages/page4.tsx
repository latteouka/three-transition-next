import { useContext, useRef } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import global from "@/utils/globalState";
import { TransitionContext } from "@/utils/TransitionContext";
import { Func } from "@/gl/core/func";
import { gsap } from "gsap";
import Link from "next/link";
import { Param } from "@/gl/core/param";
import { theme } from "@/utils/useScroll";
import useLenis from "@/utils/useLenis";
import Lenis from "@studio-freight/lenis";
import { imageDatas } from ".";
const index = 3;

const Page = () => {
  const { timeline } = useContext(TransitionContext);
  const main = useRef(null);
  const sub = useRef(null);
  const back = useRef(null);

  useLenis();

  // out
  useIsomorphicLayoutEffect(() => {
    global.lenis!.on("scroll", ({ scroll }: Lenis) => {
      global.images[index].scroll(scroll);
    });
    global.activeIndex = index;
    // hide text
    timeline!.add(
      gsap.to(back.current, {
        opacity: 0,
      }),
      0
    );
    timeline!.add(
      gsap.to(main.current, {
        opacity: 0,
      }),
      0
    );
    timeline!.add(
      gsap.to(sub.current, {
        opacity: 0,
      }),
      0
    );

    timeline!.add(
      gsap.to(".page-wrapper", {
        backgroundColor: theme[index].background,
        duration: 2,
      }),
      0
    );
    timeline!.add(
      gsap.to(Param.instance.main.progress, {
        value: -0.6,
        duration: 1,
      }),
      0
    );
    if (Func.instance.sw() > 800) {
      timeline!.add(
        gsap.to(".page-image", {
          x: Func.instance.sw() * 0.2 + 16,
          ease: "elastic",
          delay: 1,
          duration: 1.5,
        }),
        0
      );
    } else {
      timeline!.add(
        gsap.to(".page-image", {
          y: -80,
          ease: "elastic",
          delay: 1,
          duration: 1.5,
        }),
        0
      );
    }

    return () => {
      timeline?.clear();
    };
  }, []);

  // in
  useIsomorphicLayoutEffect(() => {
    if (global.images.length > 0) {
      global.images[index].changeSeletor(".page-image");
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(main.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1 });
      gsap.fromTo(sub.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1 });
    });
    Param.instance.main.progress.value = 3;

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-image-wrap">
        <div className="page-image"></div>
      </div>
      <div className="page-content">
        <div className="back-wrap">
          <div className="back" ref={back}>
            <Link href="/">Back</Link>
          </div>
        </div>
        <div className="page-title">
          <div className="page-title-main" ref={main}>
            {imageDatas[index].main}
          </div>
          <div className="page-title-sub" ref={sub}>
            {imageDatas[index].subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
