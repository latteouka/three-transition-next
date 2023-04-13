import { useEffect } from "react";
import { gsap } from "gsap";
import useImagePreloader from "@/utils/usePreloadImage";

const count = 8;

const images = [
  "/img/1.jpg",
  "/img/2.jpg",
  "/img/3.jpg",
  "/img/4.jpg",
  "/img/5.jpg",
  "/img/mask1.jpeg",
  "/img/mask2.jpeg",
  "/img/mask3.jpeg",
  "/img/mask4.jpeg",
  "/img/mask5.jpeg",
];

const Loading = () => {
  const generate = new Array(count * count).fill(0);

  const { imagesPreloaded } = useImagePreloader(images);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    });

    return () => {
      ctx.revert();
    };
  }, [imagesPreloaded]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline()
        .from(".rect", {
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
          return <div className="rect" key={index}></div>;
        })}
      </div>
    </div>
  );
};
export default Loading;
