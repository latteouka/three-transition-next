import useScroll from "@/utils/useScroll";
import { gsap } from "gsap";
import Link from "next/link";
import { useTimeline, useIsomorphicLayoutEffect } from "@chundev/gtranz";
import { Func } from "@/gl/core/func";
import global from "@/utils/globalState";
import { theme } from "@/datas/theme";
import { ImageDataType, imageDatas } from "@/datas/imageDatas";
import {
  enableLenis,
  enableLink,
  enablePointer,
  enableScroll,
  hideAllOtherImages,
  setBackgroundColor,
  setFontColor,
  showAllImages,
} from "@/utils/controls";
import BottomLink from "@/components/BottomLink";
import BottomNav from "@/components/BottomNav";
import {
  bottomLinkHide,
  bottomLinkShow,
  bottomNavHide,
  bottomNavShow,
  containerBgColor,
  imageTranLarge,
  imageTranSmall,
  mainTitleHide,
  mainTitleShow,
  progressUp,
  subTitleHide,
  subTitleShow,
} from "@/utils/animations";

export default function Home() {
  const timeline = useTimeline();
  useScroll();

  // outro
  useIsomorphicLayoutEffect(() => {
    const images = gsap.utils.toArray(".image");

    timeline.clear();
    timeline.add(
      containerBgColor("white", () => {
        enableLink(false);
        enablePointer(false);
        enableLenis(false);
        setBackgroundColor("white");
        hideAllOtherImages();
      }),
      0
    );

    timeline.add(mainTitleHide(), 0);
    timeline.add(subTitleHide(), 0);
    timeline.add(bottomNavHide(), 0);
    timeline.add(bottomLinkHide(), 0);

    images.forEach((image: any) => {
      if (Func.instance.sw() > 800) {
        timeline.add(imageTranLarge(image), 0);
      } else {
        timeline.add(imageTranSmall(image), 0);
      }
    });

    timeline.add(progressUp(), ">");
  }, []);

  // intro
  // init global styles
  useIsomorphicLayoutEffect(() => {
    const index = global.activeIndex;

    // if not loaded don't play intro
    // the first time playing intro is controled by loading component
    if (!global.loaded) return;

    // limit user control
    enablePointer(false);
    enableScroll(false);

    setFontColor(theme[index]!.color);

    const ctx = gsap.context(() => {
      bottomNavShow();
      bottomLinkShow();
      mainTitleShow(0);

      subTitleShow(0.2, () => {
        // resume user control
        enablePointer(true);
        enableScroll(true);
        // threejs images are hide during backward animation
        // when come back from detail page show them all
        showAllImages();
        // emit outro animation setup when intro is over
        // triggerFor("indexOutroReset");
      });
    });

    return () => {
      // stopListenTo("indexOutroReset", setupIndexOutro);
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
            <div className="titles">
              <div className="mainTitle-wrap">
                <div className="mainTitle">{data.main}</div>
              </div>
              <div className="subtitle-wrap">
                <div className="subtitle">{data.subtitle}</div>
              </div>
            </div>
            <div>
              <ImageBlock
                index={index}
                imagePath={data.imagePath}
                maskPath={data.maskPath}
              />
            </div>
          </div>
        );
      })}
      <BottomLink />
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
    <Link
      href={`/page${index + 1}`}
      className="image-link notouch"
      aria-label={`link to page${index + 1}`}
    >
      <div
        className={`image image${index + 1} notouch`}
        data-index={index + 1}
        data-image={imagePath}
        data-mask={maskPath}
      ></div>
    </Link>
  );
};
