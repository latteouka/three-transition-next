import "@/styles/style.scss";
import { useEffect, useRef } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";

import { Gtranz } from "@chundev/gtranz";

import { Contents } from "@/gl/parts/contents";
import Loading from "@/components/Loading";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }: AppProps) {
  let three = useRef<Contents>();

  useEffect(() => {
    if (three.current) return;
    three.current = new Contents(document.querySelector(".l-canvas"));
  }, []);

  return (
    <main className={roboto.variable}>
      <Head>
        <title>Next.js Transition</title>
      </Head>
      <canvas className="l-canvas"></canvas>
      <Gtranz>
        <Component {...pageProps} />
      </Gtranz>
      <Loading />
    </main>
  );
}
