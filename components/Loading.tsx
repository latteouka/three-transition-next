import { gsap } from "gsap";
import { AssetManager } from "@/gl/webgl/assetsManager";
import { triggerFor, useIsomorphicLayoutEffect } from "@chundev/gtranz";
import global from "@/utils/globalState";
import { useMemo } from "react";
import {
  bottomLinkShow,
  bottomNavShow,
  loadingGrid,
  mainTitleShow,
  subTitleShow,
} from "@/utils/animations";
import {
  enableLink,
  enablePointer,
  enableScroll,
  showAllImages,
} from "@/utils/controls";

const debug = false;

const count = 8;
const loadingDuration = 1.5;

function playIntroOnce() {
  const wraps = document.querySelectorAll(`.wrap`);

  // this means we are in detail page
  if (wraps.length === 0) {
    global.loaded = true;
    return;
  }
  bottomNavShow();
  bottomLinkShow();
  mainTitleShow(0.1);
  subTitleShow(0.3, () => {
    triggerFor("indexOutroReset");
    enableScroll(true);
    showAllImages();
    global.loaded = true;
    enablePointer(true);
    enableLink(true);
  });
}

const Loading = () => {
  const dummy = useMemo(() => new Array(count * count).fill(0), []);

  function loadingComplete() {
    if (debug) return;
    gsap.to(".loading-wrap", {
      opacity: -0.5,
      delay: 2.5,
      duration: loadingDuration,
      onComplete: () => {
        enableLink(false);
        document.querySelector(".loading-wrap")!.classList.toggle("hidden");
        playIntroOnce();
      },
    });
  }

  useIsomorphicLayoutEffect(() => {
    // listen to asset loading manager's status
    AssetManager.instance.addEventListener("cancelLoading", loadingComplete);
    enableScroll(false);
    enablePointer(false);

    // grid animation
    const ctx = gsap.context(() => {
      loadingGrid();
    });

    return () => {
      ctx.revert();
    };
  }, []);
  return (
    <>
      {!debug && (
        <div className="loading-wrap">
          <div className="loading">
            {dummy.map((_item, index) => {
              if (index === 18) {
                return <Word text="C" key={index} />;
              } else if (index === 27) {
                return <Word text="H" key={index} />;
              } else if (index === 36) {
                return <Word text="U" key={index} />;
              } else if (index === 45) {
                return <Word text="N" key={index} />;
              } else {
                return <div className="rect rotate" key={index}></div>;
              }
            })}
          </div>
        </div>
      )}
    </>
  );
};
export default Loading;

const Word = ({ text }: { text: string }) => {
  return (
    <div className="word-wrap rotate">
      <div className="word">{text}</div>
    </div>
  );
};
