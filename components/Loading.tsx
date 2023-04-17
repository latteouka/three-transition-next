import { AssetManager } from "@/gl/webgl/assetsManager";
import { gsap } from "gsap";
import { EasePack } from "gsap/dist/EasePack";
import useIsomorphicLayoutEffect from "@/utils/useIsomorphicLayoutEffect";
import global from "@/utils/globalState";
import { Util } from "@/gl/libs/util";

gsap.registerPlugin(EasePack);

const debug = false;
const count = 8;
const duration = 1.5;

function playIntroOnce() {
  const wraps = document.querySelectorAll(`.wrap`);
  const main = wraps[global.activeIndex].querySelector(".mainTitle")!;
  const sub = wraps[global.activeIndex].querySelector(".subtitle")!;
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
      onStart: () => {
        document.documentElement.style.pointerEvents = "none";
        global.lenis!.stop();
      },
    }
  );
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
        global.loaded = true;
      },
    }
  );
}

const Loading = () => {
  const generate = new Array(count * count).fill(0);

  function loadingComplete() {
    if (debug) return;
    gsap.to(".loading", {
      opacity: -0.5,
      delay: 2.5,
      duration,
    });
    gsap.to(".loading-wrap", {
      opacity: -0.5,
      delay: 2.5,
      duration,
      onComplete: () => {
        document.querySelector(".loading-wrap")!.classList.toggle("hidden");
        playIntroOnce();
      },
    });
  }

  useIsomorphicLayoutEffect(() => {
    AssetManager.instance.addEventListener("cancelLoading", loadingComplete);

    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline()
        .fromTo(
          ".rotate",
          {
            scale: 0,
            outlineColor: "#fff",
            rotation: 0,
          },
          {
            scale: 1,
            outlineColor: "#e7e0d8",
            rotation: -360,
            duration: 1.5,
            stagger: {
              each: 0.1,
              from: "center",
              grid: "auto",
            },
          }
        )
        .addLabel("complete");

      tl.tweenTo("complete", {
        duration: 2.5,
        ease: EasePack.SlowMo.config(0.3, 0.5, false),
        repeat: -1,
        yoyo: true,
      });
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
            {generate.map((_item, index) => {
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
