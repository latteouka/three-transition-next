import { useTimeline, useIsomorphicLayoutEffect } from "./Gransition";
import { useState } from "react";

export default function TransitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const timeline = useTimeline();

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
  }, [children]);

  // useIsomorphicLayoutEffect(() => {
  //   gsap.to(el.current, {
  //     background,
  //     duration: 1,
  //   });
  // }, [background]);

  return <div>{displayChildren}</div>;
}
