import { useContext } from "react";
import { useRouter } from "next/router";
import useIsomorphicLayoutEffect from "@/utils/useIsomorphicLayoutEffect";
import global from "@/utils/globalState";
import { TransitionContext } from "@/utils/TransitionContext";
import { Func } from "@/gl/core/func";
import { gsap } from "gsap";
import Link from "next/link";
import { theme } from "@/utils/useScroll";
import { Param } from "@/gl/core/param";

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const index = id as string;
  const { timeline } = useContext(TransitionContext);

  // out
  useIsomorphicLayoutEffect(() => {
    if (!index) return;
    timeline!.add(
      gsap.to(".page-wrapper", {
        backgroundColor: theme[global.activeIndex].background,
        duration: 1,
      }),
      0
    );
    timeline!.add(
      gsap.to(Param.instance.main.progress, {
        value: -0.6,
        duration: 2,
      }),
      0
    );
    timeline!.add(
      gsap.to(".page-image", {
        x: Func.instance.sw() * 0.2 + 16,
        delay: 2,
        ease: "elastic",
        duration: 2,
      }),
      0
    );
    global.images[parseInt(index) - 1].changeSeletor(`.image${index}`);
  }, [router]);

  // in
  useIsomorphicLayoutEffect(() => {
    if (!index) return;
    global.images[parseInt(index) - 1].changeSeletor(".page-image");
    // Param.instance.main.progress.value = 3;
  }, [router]);

  return (
    <div className="page-wrapper">
      <div className="page-image-wrap">
        <div className="page-image"></div>
      </div>
      <div className="page-content">
        <div className="back">
          <Link href="/">Back</Link>
        </div>
        <p>Post: {id}</p>
      </div>
    </div>
  );
};

export default Page;
