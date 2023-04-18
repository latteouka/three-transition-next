import { useState } from "react";
import { useIsomorphicLayoutEffect, useTimeline } from "./Gransition";
import gsap from "gsap";

const useIntroOutro = (
  intros: [() => gsap.core.Tween],
  outros: [() => gsap.core.Tween]
) => {
  const [introPlayed, setIntroPlayed] = useState(false);
  const timeline = useTimeline();

  // intro
  useIsomorphicLayoutEffect(() => {
    intros[0]().eventCallback("onComplete", () => setIntroPlayed(true));
  }, []);
  // outro
  useIsomorphicLayoutEffect(() => {
    if (!introPlayed) return;
    console.log("outro setup");
    timeline.add(outros[0]());
  }, [introPlayed]);
};

export default useIntroOutro;
