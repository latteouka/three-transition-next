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

  // outro
  useIsomorphicLayoutEffect(() => {
    const wraps = document.querySelectorAll(`.wrap`);
    const images = gsap.utils.toArray(".image");
    const main = wraps[global.activeIndex].querySelector(".mainTitle")!;
    const sub = wraps[global.activeIndex].querySelector(".subtitle")!;

    timeline!.add(
      gsap.to(`.container`, {
        backgroundColor: "#fff",
        duration: 1,
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
        duration: 1,
      }),
      0
    );
    timeline!.add(
      gsap.to(sub, {
        y: -100,
        duration: 1,
      }),
      0
    );
    timeline?.addLabel("down");
    images.forEach((image: any) => {
      if (Func.instance.sw() > 800) {
        timeline!.add(
          gsap.to(image, {
            x: -Func.instance.sw() * 0.2 - 16,
            ease: "elastic",
            duration: 1.5,
          }),
          0
        );
        timeline!.add(
          gsap.to(image, {
            y: 150,
            ease: "linear",
            duration: 1.3,
          }),
          "down"
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
        duration: 1.3,
        ease: "linear",
        onComplete: () => {
          global.lenis!.start();
          document.documentElement.style.pointerEvents = "auto";
        },
      }),
      "down"
    );

    return () => {
      timeline?.clear();
    };
  }, [global.activeIndex]);

  // intro
  useIsomorphicLayoutEffect(() => {
    global.lenis!.stop();
    document.documentElement.style.pointerEvents = "none";
    const wraps = document.querySelectorAll(`.wrap`);
    const main = wraps[global.activeIndex].querySelector(".mainTitle")!;
    const sub = wraps[global.activeIndex].querySelector(".subtitle")!;
    document.documentElement.style.setProperty(
      "--backgroundColor",
      theme[global.activeIndex].background
    );
    document.documentElement.style.setProperty(
      "--fontColor",
      theme[global.activeIndex].color
    );

    const ctx = gsap.context(() => {
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
            global.lenis!.start();
            // when come back from detail page
            // show threejs images
            global.images.forEach((image) => {
              image.show();
            });
            document.documentElement.style.pointerEvents = "auto";
          },
        }
      );
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
    </div>
  );
}

interface ImageProps {
  index: number;
  imagePath: string;
  maskPath: string;
}

const Image = ({ index, imagePath, maskPath }: ImageProps) => {
  useIsomorphicLayoutEffect(() => {
    if (global.images.length > 0) {
      global.images[index].changeSeletor(`.image${index + 1}`);
    }
  }, []);
  return (
    // <Link href={`/page1`}>
    <Link href={`/page${index + 1}`}>
      {/* <Link href={`/page1`}> */}
      <div
        className={`image image${index + 1}`}
        data-index={index + 1}
        data-image={imagePath}
        data-mask={maskPath}
      ></div>
    </Link>
  );
};
