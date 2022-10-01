import Footer from "@components/Footer";
import Roadmap from "@components/Question";
import Story from "@components/Story";
import Art from "@components/Art";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Title from "@components/Title";
import Question from "@components/Question";
import { Button, Flex, HStack, Image, Input, Tab, TabList, TabPanel, TabPanels, Tabs, useNumberInput } from "@chakra-ui/react";

const Test: NextPage = () => {
  console.log("Test");

  console.log("KEY: ", process.env.NEXT_PUBLIC_KEY);
  

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
    >
      <Image
        w={"140px"}
        src={`../images/profile_400.png`}
        rounded={"full"}
        alt="loading"
      />
     
    </Flex>
    
    
  )
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Test;
