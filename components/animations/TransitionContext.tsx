import { useState, createContext } from "react";
import gsap from "gsap";

interface TransitionContextProps {
  timeline: gsap.core.Timeline | null;
  background: string;
  setTimeline: any;
  setBackground: any;
}

const TransitionContext = createContext<TransitionContextProps>({
  timeline: null,
  background: "#e7e0d8",
  setTimeline: null,
  setBackground: null,
});

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [timeline, setTimeline] = useState(() =>
    gsap.timeline({ paused: true })
  );

  const [background, setBackground] = useState("#e7e0d8");

  return (
    <TransitionContext.Provider
      value={{
        timeline,
        setTimeline,
        background,
        setBackground,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export { TransitionContext, TransitionProvider };
