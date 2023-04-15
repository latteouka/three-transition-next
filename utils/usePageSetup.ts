import { useContext, useEffect, useState } from "react";
import useIsomorphicLayoutEffect from "@/utils/useIsomorphicLayoutEffect";
import global from "@/utils/globalState";
import { TransitionContext } from "@/utils/TransitionContext";
import { Func } from "@/gl/core/func";
import { gsap } from "gsap";
import { Param } from "@/gl/core/param";
import { theme } from "@/datas/theme";
import Lenis from "@studio-freight/lenis";

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

// hide all other threejs images
function hideAllOtherImages() {
  global.images.forEach((image, index) => {
    if (index === global.activeIndex) return;
    image.hide();
  });
}

const usePageSetup = (index: number) => {
  // when intro is done, use this state to trigger outro setup
  const [loaded, setLoaded] = useState(false);
  const { timeline } = useContext(TransitionContext);

  // out
  useIsomorphicLayoutEffect(() => {
    // hide text
    timeline!.add(
      gsap.to(".back", {
        opacity: 0,
        onStart: () => {
          window.scrollTo({
            top: 0,
          });
          global.lenis?.stop();
          global.images[index].needUpdateTrue();
        },
      }),
      0
    );
    timeline!.add(
      gsap.to(".page-title-main", {
        opacity: 0,
      }),
      0
    );
    timeline!.add(
      gsap.to(".page-title-sub", {
        opacity: 0,
      }),
      0
    );

    timeline!.add(
      gsap.to(".page-wrapper", {
        backgroundColor: theme[index].background,
        delay: 0.5,
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
      timeline!.add(
        gsap.to(".page-image", {
          y: -80,
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
  }, [loaded]);

  // intro
  useIsomorphicLayoutEffect(() => {
    global.activeIndex = index;

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

            setLoaded(true);
          },
        }
      );
    });

    // when user directly enter page
    Param.instance.main.progress.value = 3;

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    global.lenis!.on("scroll", ({ scroll }: Lenis) => {
      global.images[index].scroll(scroll);
    });
  }, []);
};
export default usePageSetup;
