import { TransitionContext } from "@/utils/TransitionContext";
import { useState, useContext, useRef } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

export default function TransitionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("layout");
  const [displayChildren, setDisplayChildren] = useState(children);
  const { timeline, background } = useContext(TransitionContext);
  console.log(displayChildren);
  const el = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (children !== displayChildren) {
      if (timeline!.duration() === 0) {
        // there are no outro animations, so immediately transition
        setDisplayChildren(children);
      } else {
        timeline!.play().then(() => {
          // outro complete so reset to an empty paused timeline
          timeline!.pause().clear();
          setDisplayChildren(children);
        });
      }
    }
  }, [children]);

  // useIsomorphicLayoutEffect(() => {
  // timeline!.to(el.current, {
  //   scale: 1.2,
  //   duration: 2,
  // });
  // gsap.to(el.current, {
  //   background,
  //   duration: 1,
  // });
  // }, [background]);

  return <div ref={el}>{displayChildren}</div>;
}
