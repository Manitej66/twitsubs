import { GeistProvider, CssBaseline } from "@geist-ui/react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const myTheme = {
    type: "dark",
    palette: {
      accents_1: "#111",
      accents_2: "#333",
      accents_3: "#444",
      accents_4: "#666",
      accents_5: "#888",
      accents_6: "#999",
      accents_7: "#eaeaea",
      accents_8: "#fafafa",
      background: "#000",
      foreground: "#fff",
      selection: "#f81ce5",
      secondary: "#888",
      code: "#79ffe1",
      border: "#333",
      link: "#3291ff",
    },
    expressiveness: {
      dropdownBoxShadow: "0 0 0 1px #333",
      shadowSmall: "0 0 0 1px #333",
      shadowMedium: "0 0 0 1px #333",
      shadowLarge: "0 0 0 1px #333",
      portalOpacity: 0.75,
    },
  };

  return (
    <GeistProvider theme={myTheme}>
      <Head>
        <title>Youtubio ~ automate sub count in twitter bio</title>
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  );
}
export default MyApp;
