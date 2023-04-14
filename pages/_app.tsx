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

gsap.defaults({ overwrite: true });

const font = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--noto-font",
});

export default function App({ Component, pageProps }: AppProps) {
  let three = useRef<Contents>();

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
          <Component {...pageProps} />
          <Loading />
        </main>
      </TransitionLayout>
    </TransitionProvider>
  );
}
