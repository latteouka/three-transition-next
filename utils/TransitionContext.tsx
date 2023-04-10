import { useState, createContext, Dispatch, SetStateAction } from "react";
import gsap from "gsap";

interface TransitionContextProps {
  timeline: gsap.core.Timeline | null;
  background: string;
  setTimeline: any;
  setBackground: any;
}

const TransitionContext = createContext<TransitionContextProps>({
  timeline: null,
  background: "#fff",
  setTimeline: null,
  setBackground: null,
});

const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [timeline, setTimeline] = useState(() =>
    gsap.timeline({ paused: true })
  );

  const [background, setBackground] = useState("white");

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
