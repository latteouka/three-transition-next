import Lenis from "@studio-freight/lenis";
import { useEffect, useRef, useState } from "react";
import useIsomorphicLayoutEffect from "@/utils/useIsomorphicLayoutEffect";
import global from "./globalState";
import { gsap } from "gsap";

const useScroll = () => {
  const [lenis, setLenis] = useState<Lenis | null>();
  const reqIdRef = useRef<ReturnType<typeof requestAnimationFrame>>();

  useEffect(() => {
    const animate = (time: DOMHighResTimeStamp) => {
      lenis?.raf(time);
      reqIdRef.current = requestAnimationFrame(animate);
    };
    reqIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqIdRef.current as number);
  }, [lenis]);

  useIsomorphicLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true,
      touchMultiplier: 3.5,
    });

    lenis.on("scroll", ({ progress }: any) => {
      gsap.to(".scrollbar", {
        y: Math.max(progress * window.innerHeight - 30, 0),
        duration: 0.6,
      });
    });

    setLenis(lenis);
    global.lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);
};
export default useScroll;
