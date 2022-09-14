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

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 2,
    })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  const onClick = () => {
    console.log("input: ", input["aria-valuenow"]);
  }

  return (
    <Flex>
      <HStack maxW='320px'>
        <Button {...inc}>+</Button>
        <Input {...input} variant='filled' />
        <Button {...dec}>-</Button>
      </HStack>

      <Button onClick={onClick}>클릭</Button>
    </Flex>
    
  )
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Test;
