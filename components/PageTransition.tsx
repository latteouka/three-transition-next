import { useRouter } from "next/router";
import { TransitionGroup, CSSTransition } from "react-transition-group";

interface Props {
  children: React.ReactNode;
  route: string;
}

const PageTransition = ({ children }: Props) => {
  const router = useRouter();

  function onPageEnter() {
    console.log("enter");
  }

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={router.pathname}
        timeout={1200}
        classNames="transition"
        onEnter={onPageEnter}
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};
export default PageTransition;
