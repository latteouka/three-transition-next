import "@/styles/style.scss";
import { useEffect, useRef } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";

import { Gtranz } from "@chundev/gtranz";

import { Contents } from "@/gl/parts/contents";
import Loading from "@/components/Loading";

export default function App({ Component, pageProps }: AppProps) {
  let three = useRef<Contents>();

  useEffect(() => {
    if (three.current) return;
    three.current = new Contents(document.querySelector(".l-canvas"));
  }, []);

  return (
    <main>
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
