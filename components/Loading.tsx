import { useEffect } from "react";
import { gsap } from "gsap";
import useImagePreloader from "@/utils/usePreloadImage";

const count = 8;

const Loading = ({ loaded }: { loaded: boolean }) => {
  console.log("loading");
  const generate = new Array(count * count).fill(0);

  useEffect(() => {
    console.log(loaded);
    const ctx = gsap.context(() => {
      if (loaded) {
        gsap.to(".loading", {
          opacity: 0,
          delay: 2.3,
          ease: "linear",
          duration: 1.4,
        });
        gsap.to(".loading-wrap", {
          opacity: 0,
          delay: 2.3,
          ease: "linear",
          duration: 1.5,
          onComplete: () => {
            document.querySelector(".loading-wrap")!.classList.toggle("hidden");
          },
        });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [loaded]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline()
        .from(".rotate", {
          scale: 0,
          outlineColor: "#fff",
          rotation: -360,
          duration: 1.5,
          stagger: {
            each: 0.1,
            from: "center",
            grid: "auto",
          },
        })
        .addLabel("complete");

      tl.tweenTo("complete", {
        duration: 1.6,
        ease: "slow(0.8, 0.9, false)",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.1,
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);
  return (
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
