import {
  useTimeline,
  useIsomorphicLayoutEffect,
} from "@/components/animations/Gransition";
import useIntroOutro from "@/components/animations/useIntroOutro";
import { gsap } from "gsap";
import Link from "next/link";
import { useRef } from "react";

const Page = () => {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const timeline = useTimeline();

  // useIntroOutro(
  //   [
  //     () =>
  //       gsap.to(ref.current, {
  //         y: 300,
  //         duration: 3,
  //       }),
  //   ],
  //   [
  //     () =>
  //       gsap.to(ref.current, {
  //         y: 0,
  //       }),
  //   ]
  // );
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: 300,
        duration: 3,
      });
    });

    timeline.add(
      gsap.to(ref.current, {
        y: 0,
        duration: 3,
      })
    );

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} style={{ transform: "translateY(0)" }}>
      <Link href="/">Test</Link>
      <div ref={ref2}>sdfs</div>
    </div>
  );
};
export default Page;
