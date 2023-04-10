"use client";
import { gsap } from "gsap";
import useScroll from "@/utils/useScroll";
import Link from "next/link";
import { useContext, useRef } from "react";
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
    main: "Title 1",
    subtitle: "Subtitle",
    imagePath: "/img/1.jpg",
    maskPath: "/img/mask1.jpeg",
  },
  {
    main: "Title 2",
    subtitle: "Subtitle",
    imagePath: "/img/2.jpg",
    maskPath: "/img/mask2.jpeg",
  },
  {
    main: "Title 3",
    subtitle: "Subtitle",
    imagePath: "/img/3.jpg",
    maskPath: "/img/mask3.jpeg",
  },
  {
    main: "Title 4",
    subtitle: "Subtitle",
    imagePath: "/img/4.jpg",
    maskPath: "/img/mask4.jpeg",
  },
  {
    main: "Title 5",
    subtitle: "Subtitle",
    imagePath: "/img/5.jpg",
    maskPath: "/img/mask5.jpeg",
  },
];

export default function Home() {
  console.log("home");
  const { timeline } = useContext(TransitionContext);

  useScroll();

  // outro
  useIsomorphicLayoutEffect(() => {
    console.log("setup");
    const wraps = document.querySelectorAll(`.wrap`);
    const images = gsap.utils.toArray(".image");
    const main = wraps[global.activeIndex].querySelector(".mainTitle")!;
    const sub = wraps[global.activeIndex].querySelector(".subtitle")!;

    timeline!.add(
      gsap.to(`.container`, {
        backgroundColor: "#fff",
        duration: 1,
        onStart: () => {
          global.lenis!.stop();
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
    images.forEach((image: any) => {
      if (Func.instance.sw() > 800) {
        timeline!.add(
          gsap.to(image, {
            x: -Func.instance.sw() * 0.2 - 16,
            ease: "elastic",
            duration: 1.5,
            onComplete: () => {
              console.log("complete");
            },
          }),
          0
        );
      } else {
        timeline!.add(
          gsap.to(image, {
            y: 80,
            ease: "elastic",
            duration: 1.5,
            onComplete: () => {
              console.log("complete");
            },
          }),
          0
        );
      }
    });
    timeline!.add(
      gsap.to(Param.instance.main.progress, {
        value: 2.2,
        duration: 1.8,
        onComplete: () => {
          global.images.forEach((image, index) => {
            if (index === global.activeIndex) return;
            image.hide();
          });
          global.lenis!.start();
        },
      }),
      ">"
    );

    return () => {
      timeline?.clear();
    };
  }, [global.activeIndex]);

  // in
  // init global styles
  useIsomorphicLayoutEffect(() => {
    global.lenis!.stop();
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
          },
        }
      );
    });

    global.images.forEach((image) => {
      image.show();
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
                <div className="mainTitle">Title {index + 1}</div>
              </div>
              <div className="subtitle-wrap">
                <div className="subtitle">Subtitle</div>
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
