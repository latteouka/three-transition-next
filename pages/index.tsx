"use client";
import { gsap } from "gsap";
import useScroll from "@/utils/useScroll";
import Link from "next/link";
import { useContext } from "react";
import { TransitionContext } from "@/utils/TransitionContext";
import { useIsomorphicLayoutEffect } from "react-use";
import { Func } from "@/gl/core/func";
import global from "@/utils/globalState";
import { Param } from "@/gl/core/param";
import { theme } from "@/utils/useScroll";
import { Util } from "@/gl/libs/util";
const distance = 1300;

interface Data {
  main: string;
  subtitle: string;
  imagePath: string;
  maskPath: string;
}

export const imageDatas: Data[] = [
  {
    main: "京都",
    subtitle: "錦市場",
    imagePath: "/img/1.jpg",
    maskPath: "/img/mask1.jpeg",
  },
  {
    main: "祇園",
    subtitle: "四条",
    imagePath: "/img/2.jpg",
    maskPath: "/img/mask2.jpeg",
  },
  {
    main: "嵐山",
    subtitle: "竹の道",
    imagePath: "/img/3.jpg",
    maskPath: "/img/mask3.jpeg",
  },
  {
    main: "京都",
    subtitle: "稲荷駅",
    imagePath: "/img/4.jpg",
    maskPath: "/img/mask4.jpeg",
  },
  {
    main: "京都",
    subtitle: "伏見稲荷大社",
    imagePath: "/img/5.jpg",
    maskPath: "/img/mask5.jpeg",
  },
];

export default function Home() {
  const { timeline } = useContext(TransitionContext);
  useScroll();

  // setup outro animation
  // this function is for a custom event listener
  // because I need to overwrite gsap tween after another animation
  function setup() {
    const wraps = document.querySelectorAll(`.wrap`);
    const images = gsap.utils.toArray(".image");
    const main = wraps[global.activeIndex].querySelector(".mainTitle")!;
    const sub = wraps[global.activeIndex].querySelector(".subtitle")!;

    timeline!.add(
      gsap.to(`.container`, {
        backgroundColor: "#fff",
        duration: 1,
        overwrite: true,
        onStart: () => {
          document.documentElement.style.pointerEvents = "none";
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
          document.documentElement.style.pointerEvents = "auto";
        },
      }),
      ">"
    );
  }

  // intro
  // init global styles
  useIsomorphicLayoutEffect(() => {
    // listen for the scroll animation in useScroll hook
    document.addEventListener("setupAnimation", setup);

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
      document.removeEventListener("setup", setup);
      ctx.revert();
    };
  }, []);

  // initial positions
  useIsomorphicLayoutEffect(() => {
    const images = document.querySelectorAll(
      ".image"
    )! as NodeListOf<HTMLDivElement>;
    const now = global.activeIndex;
    const ctx = gsap.context(() => {
      images.forEach((image, index) => {
        if (index === now) return;
        gsap.set(image, {
          x: -distance,
          y: distance,
        });
      });
    });
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="container">
      {imageDatas.map((data: Data, index) => {
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
            <Image
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

const Image = ({ index, imagePath, maskPath }: ImageProps) => {
  function setupSelectors() {
    global.images[index].changeSeletor(`.image${index + 1}`);
  }
  useIsomorphicLayoutEffect(() => {
    document.addEventListener("setupSelectors", setupSelectors);
  }, []);
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
      <div className="bottomNav-before" onClick={() => before()}>
        Before
      </div>
      <div>/</div>
      <div className="bottomNav-after" onClick={() => next()}>
        After
      </div>
    </div>
  );
};
