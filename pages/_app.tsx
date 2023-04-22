import "@/styles/style.scss";
import { useEffect, useRef } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Noto_Sans_JP } from "next/font/google";

import { Gtranz } from "@chundev/gtranz";

import { Contents } from "@/gl/parts/contents";
import Loading from "@/components/Loading";
import { gsap } from "gsap";

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
    <Gtranz>
      <main className={font.className}>
        <Head>
          <title>Next.js Transition</title>
        </Head>
        <canvas className="l-canvas"></canvas>
        <Component {...pageProps} />
        <Loading />
      </main>
    </Gtranz>
  );
}
