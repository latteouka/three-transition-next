import { useRouter } from "next/router";
import { useTimeline, useIsomorphicLayoutEffect } from "./Gransition";
import { useState, useRef } from "react";

export default function TransitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const router = useRouter();
  const timeline = useTimeline();
  const el = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (children !== displayChildren) {
      if (timeline.duration() === 0) {
        // there are no outro animations, so immediately transition
        setDisplayChildren(children);
      } else {
        timeline.play().then(() => {
          // outro complete so reset to an empty paused timeline
          timeline.pause().clear();
          setDisplayChildren(children);
        });
      }
    }
  }, [router.asPath]);

  // useIsomorphicLayoutEffect(() => {
  //   gsap.to(el.current, {
  //     background,
  //     duration: 1,
  //   });
  // }, [background]);

  return <div ref={el}>{displayChildren}</div>;
}
