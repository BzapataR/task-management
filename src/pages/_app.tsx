import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function ({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
