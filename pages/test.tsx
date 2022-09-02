import Footer from "@components/Footer";
import Roadmap from "@components/Question";
import Story from "@components/Story";
import Art from "@components/Art";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Title from "@components/Title";
import Question from "@components/Question";
import { Flex, Image, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

const Test: NextPage = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      <Tabs defaultIndex={1}>
          <TabPanels>
            <TabPanel>
              <Image
                boxSize='200px'
                fit='cover'
                src='https://resizing.flixster.com/wTgvsiM8vNLhCcCH-6ovV8n5z5U=/300x300/v1.bjsyMDkxMzI5O2o7MTgyMDQ7MTIwMDsxMjAwOzkwMA'
              />
            </TabPanel>
            <TabPanel>
              <Image
                boxSize='200px'
                fit='cover'
                src='https://vignette.wikia.nocookie.net/naruto/images/2/21/Sasuke_Part_1.png/revision/latest?cb=20170716092103'
              />
            </TabPanel>
          </TabPanels>
          <TabList>
            <Tab>Naruto</Tab>
            <Tab>Sasuke</Tab>
            <Tab>Naruto</Tab>
            <Tab>Sasuke</Tab>
            <Tab>Naruto</Tab>
            <Tab>Sasuke</Tab>
            <Tab>Naruto</Tab>
            <Tab>Sasuke</Tab>
            <Tab>Naruto</Tab>
            <Tab>Sasuke</Tab>
            <Tab>Naruto</Tab>
            <Tab>Sasuke</Tab>

          </TabList>
    </Tabs>
    </Flex>
    
    
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Test;
