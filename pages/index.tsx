import { gsap } from "gsap";
import useScroll from "@/utils/useScroll";
import Link from "next/link";
import { useCallback, useContext } from "react";
import { TransitionContext } from "@/utils/TransitionContext";
import useIsomorphicLayoutEffect from "@/utils/useIsomorphicLayoutEffect";
import { Func } from "@/gl/core/func";
import global from "@/utils/globalState";
import { Param } from "@/gl/core/param";
import { theme } from "@/datas/theme";
import { Util } from "@/gl/libs/util";
import { ImageDataType, imageDatas } from "@/datas/imageDatas";

export function enableLink(enable: boolean) {
  const links = document.querySelectorAll(
    ".image-link"
  )! as NodeListOf<HTMLDivElement>;

  links.forEach((link) => {
    link.style.pointerEvents = enable ? "auto" : "none";
  });
}

export default function Home() {
  const { timeline } = useContext(TransitionContext);
  useScroll();

  // setup outro animation
  // this function is for a custom event listener
  // because I need to overwrite gsap tween after another animation
  const setupIndexOutro = useCallback(() => {
    const wraps = document.querySelectorAll(`.wrap`);
    const images = gsap.utils.toArray(".image");
    const main = wraps[global.activeIndex].querySelector(".mainTitle")!;
    const sub = wraps[global.activeIndex].querySelector(".subtitle")!;

    timeline?.clear();
    timeline!.add(
      gsap.to(`.container`, {
        backgroundColor: "#fff",
        duration: 1,
        onStart: () => {
          enableLink(false);

          global.lenis!.stop();
          global.images.forEach((image, index) => {
            if (index === global.activeIndex) return;
            image.hide();
          });
        },
      }),
      0
    );
    timeline!.add(
      gsap.to(main, {
        y: -100,
        opacity: 0,
        duration: 1,
      }),
      0
    );
    timeline!.add(
      gsap.to(sub, {
        y: -100,
        opacity: 0,
        duration: 1,
      }),
      0
    );
    timeline!.add(
      gsap.to(".bottomNav", {
        y: 100,
        opacity: 0,
        duration: 1,
      }),
      0
    );
    images.forEach((image: any) => {
      if (Func.instance.sw() > 800) {
        timeline!.add(
          gsap.to(image, {
            x: -Func.instance.sw() * 0.2 - 16,
            y: 150,
            ease: "elastic",
            duration: 1.5,
          }),
          0
        );
      } else {
        timeline!.add(
          gsap.to(image, {
            y: 80,
            ease: "elastic",
            duration: 1.5,
          }),
          0
        );
      }
    });
    timeline!.add(
      gsap.to(Param.instance.main.progress, {
        value: 2.2,
        duration: 1.8,
        ease: "linear",
        onComplete: () => {
          global.lenis!.start();

          enableLink(true);
        },
      }),
      ">"
    );
  }, [timeline]);

  // intro
  // init global styles
  useIsomorphicLayoutEffect(() => {
    // listen for the scroll animation in useScroll hook
    document.addEventListener("setupAnimation", setupIndexOutro);

    // limit user control
    document.documentElement.style.pointerEvents = "none";
    global.lenis!.stop();

    // when back from next page change colors based on activeIndex
    document.documentElement.style.setProperty(
      "--backgroundColor",
      theme[global.activeIndex].background
    );
    document.documentElement.style.setProperty(
      "--fontColor",
      theme[global.activeIndex].color
    );

    // titles animation
    const wraps = document.querySelectorAll(`.wrap`);
    const main = wraps[global.activeIndex].querySelector(".mainTitle")!;
    const sub = wraps[global.activeIndex].querySelector(".subtitle")!;
    const ctx = gsap.context(() => {
      gsap.fromTo(
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
      ),
        0;
      gsap.fromTo(
        main,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          delay: 0.5,
        }
      );
      gsap.fromTo(
        sub,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          delay: 0.8,
          onComplete: () => {
            // resume user control
            document.documentElement.style.pointerEvents = "auto";
            global.lenis!.start();
            // threejs images are hide during backward animation
            // when come back from detail page show them all
            global.images.forEach((image) => {
              image.show();
            });

            // emit outro animation setup
            Util.instance.ev("setupAnimation", {});
          },
        }
      );
    });

    return () => {
      document.removeEventListener("setupAnimation", setupIndexOutro);
      ctx.revert();
    };
  }, []);

  // initial positions(separate images)
  useIsomorphicLayoutEffect(() => {
    const images = document.querySelectorAll(
      ".image"
    )! as NodeListOf<HTMLDivElement>;
    const now = global.activeIndex;
    const ctx = gsap.context(() => {
      images.forEach((image, index) => {
        if (index === now) return;
        gsap.set(image, {
          x: -global.distance,
          y: global.distance,
        });
      });
    });
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="container">
      {imageDatas.map((data: ImageDataType, index) => {
        return (
          <div className="wrap" key={index}>
            <div className="spacer"></div>
            <div className="titles">
              <div className="mainTitle-wrap">
                <div className="mainTitle">{data.main}</div>
              </div>
              <div className="subtitle-wrap">
                <div className="subtitle">{data.subtitle}</div>
              </div>
            </div>
            <ImageBlock
              index={index}
              imagePath={data.imagePath}
              maskPath={data.maskPath}
            />
          </div>
        );
      })}
      <BottomNav />
    </div>
  );
}

interface ImageProps {
  index: number;
  imagePath: string;
  maskPath: string;
}

const ImageBlock = ({ index, imagePath, maskPath }: ImageProps) => {
  return (
    <Link href={`/page${index + 1}`} className="image-link">
      <div
        className={`image image${index + 1}`}
        data-index={index + 1}
        data-image={imagePath}
        data-mask={maskPath}
      ></div>
    </Link>
  );
};

const BottomNav = () => {
  function before() {
    const wheelEvt = document.createEvent("MouseEvents") as any;
    wheelEvt.initEvent("wheel", true, true);
    wheelEvt.deltaY = -170;
    document.dispatchEvent(wheelEvt);
  }
  function next() {
    const wheelEvt = document.createEvent("MouseEvents") as any;
    wheelEvt.initEvent("wheel", true, true);
    wheelEvt.deltaY = 170;
    document.dispatchEvent(wheelEvt);
  }
  return (
    <div className="bottomNav">
      <div className="bottomNav-before notouch" onClick={() => before()}>
        Before
      </div>
      <div>/</div>
      <div className="bottomNav-after notouch" onClick={() => next()}>
        After
      </div>
    </div>
  );
};
