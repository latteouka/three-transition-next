import Link from "next/link";
import useLenis from "@/utils/useLenis";
import { imageDatas } from "@/datas/imageDatas";
import usePageSetup from "@/utils/usePageSetup";

const index = 3;

const Page = () => {
  useLenis();
  usePageSetup(index);

  return (
    <div className="page-wrapper">
      <div className="page-image-wrap">
        <div className="page-image"></div>
      </div>
      <div className="page-content">
        <div className="back-wrap">
          <div className="back">
            <Link href="/" className="page-back">
              Back
            </Link>
          </div>
        </div>
        <div className="page-title">
          <div className="page-title-main">{imageDatas[index].main}</div>
          <div className="page-title-sub">{imageDatas[index].subtitle}</div>
        </div>
        <div className="page-section1"></div>
        <div className="page-section2"></div>
      </div>
      <div className="scrollbar-wrap">
        <div className="scrollbar-bg"></div>
        <div className="scrollbar"></div>
      </div>
    </div>
  );
};

export default Page;
