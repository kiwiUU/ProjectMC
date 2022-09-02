import Footer from "@components/Footer";
import Roadmap from "@components/Question";
import Story from "@components/Story";
import Art from "@components/Art";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Title from "@components/Title";
import Question from "@components/Question";

const Home: NextPage = () => {
  return (
    <>
      <Title />
      <Art />
      <Story />
      <Question />
      <Footer />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Home;
