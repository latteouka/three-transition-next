import { Contents } from "@/gl/parts/contents";
import "@/styles/style.scss";
import type { AppProps } from "next/app";
import { useEffect, useRef } from "react";
import { Noto_Sans_JP } from "next/font/google";
import Head from "next/head";
import { TransitionProvider } from "@/utils/TransitionContext";
import TransitionLayout from "@/components/animations/TransitionLayout";
import { gsap } from "gsap";
import Loading from "@/components/Loading";
import useImagePreloader from "@/utils/usePreloadImage";
gsap.defaults({ overwrite: true });

const font = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--noto-font",
});

export default function App({ Component, pageProps }: AppProps) {
  let three = useRef<Contents>();

  const { imagesPreloaded } = useImagePreloader(images);
  useEffect(() => {
    if (three.current) return;
    three.current = new Contents(document.querySelector(".l-canvas"));
  }, []);
  return (
    <TransitionProvider>
      <TransitionLayout>
        <main className={font.className}>
          <Head>
            <title>Mask Blob</title>
          </Head>
          <canvas className="l-canvas"></canvas>
          <Loading loaded={imagesPreloaded} />
          {imagesPreloaded && <Component {...pageProps} />}
        </main>
      </TransitionLayout>
    </TransitionProvider>
  );
}

const images = [
  "/img/1.jpg",
  "/img/2.jpg",
  "/img/3.jpg",
  "/img/4.jpg",
  "/img/5.jpg",
  "/img/mask1.jpeg",
  "/img/mask2.jpeg",
  "/img/mask3.jpeg",
  "/img/mask4.jpeg",
  "/img/mask5.jpeg",
];
