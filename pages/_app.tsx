import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Layout from "@components/Layout";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import Fonts from "public/fonts/Fonts";

const theme = extendTheme({
  fonts: {
    heading: `'Heading Font Name', sans-serif`,
    body: `'Body Font Name', sans-serif`,
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default appWithTranslation(MyApp);
