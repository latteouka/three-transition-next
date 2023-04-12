import Lenis from "@studio-freight/lenis";
import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import global from "./globalState";

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
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true,
      touchMultiplier: 3,
    });

    setLenis(lenis);
    global.lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);
};
export default useScroll;
