import { useEffect } from "react";
import global from "@/utils/globalState";
import { Func } from "@/gl/core/func";
import { gsap } from "gsap";
import { Param } from "@/gl/core/param";
import { theme } from "@/datas/theme";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  enableBack,
  enablePointer,
  enableScroll,
  hideAllOtherImages,
  setBackgroundColor,
} from "./controls";
import { useIsomorphicLayoutEffect, useTimeline } from "@chundev/gtranz";

gsap.registerPlugin(ScrollTrigger);

// change threejs images following target
function selectorToIndex() {
  global.images.forEach((image, index) => {
    image.changeSeletor(`.image${index + 1}`);
  });
}
function selectorToPage() {
  global.images.forEach((image) => {
    image.changeSeletor(".page-image");
  });
}

const usePageSetup = (index: number) => {
  const timeline = useTimeline();

  // out
  useIsomorphicLayoutEffect(() => {
    // hide text
    timeline.add(
      gsap.to(".back", {
        opacity: 0,
        onStart: () => {
          enablePointer(false);
          enableBack(false);
          enableScroll(false);
          window.scrollTo({
            top: 0,
          });
          global.lenis?.stop();
          global.images[index]!.needUpdateTrue();
        },
      }),
      0
    );
    timeline.add(
      gsap.to(".page-title-main", {
        opacity: 0,
      }),
      0
    );
    timeline.add(
      gsap.to(".page-title-sub", {
        opacity: 0,
      }),
      0
    );

    timeline.add(
      gsap.to(".page-wrapper", {
        backgroundColor: theme[index]!.background,
        delay: 0.5,
        duration: 1,
        onStart: () => {
          setBackgroundColor(theme[global.activeIndex]!.background);
        },
      }),
      0
    );
    timeline.add(
      gsap.to(Param.instance.main.progress, {
        value: -0.6,
        duration: 1,
      }),
      0
    );
    if (Func.instance.sw() > 800) {
      timeline.add(
        gsap.to(".page-image", {
          x: Func.instance.sw() * 0.2,
          y: -150,
          ease: "elastic",
          delay: 0.8,
          duration: 1.5,
          onComplete: () => {
            selectorToIndex();
          },
        }),
        0
      );
    } else {
      timeline.add(
        gsap.to(".page-image", {
          y: -64,
          ease: "elastic",
          delay: 0.8,
          duration: 1.5,
          onComplete: () => {
            selectorToIndex();
          },
        }),
        0
      );
    }

    return () => {
      timeline?.clear();
    };
  }, []);

  // intro
  useIsomorphicLayoutEffect(() => {
    global.activeIndex = index;
    enableBack(false);
    enablePointer(false);
    enableScroll(false);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-title-main",
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
        }
      );
      gsap.fromTo(
        ".page-title-sub",
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          onComplete: () => {
            selectorToPage();
            hideAllOtherImages();

            enableBack(true);
            enablePointer(true);
            enableScroll(true);
          },
        }
      );

      gsap.to(Param.instance.main.colorFactor, {
        value: 1,
        scrollTrigger: {
          trigger: ".page-section2",
          start: "top bottom",
          end: "+=400",
          scrub: 1,
        },
      });
    });

    // when user directly enter page
    Param.instance.main.progress.value = 1.7;

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!global.lenis || !global.images[0]) return;
    global.lenis.on("scroll", ({ scroll }: Lenis) => {
      global.images[index]!.scroll(scroll);
    });
  }, [index]);
};
export default usePageSetup;
