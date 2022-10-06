import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Flex, HStack, Image, Input, Tab, TabList, TabPanel, TabPanels, Tabs, useNumberInput } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers, Signer } from "ethers";
import { setInterval } from "timers/promises";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";

const Test: NextPage = () => {

  const [age, setAge] = useState(1);
  const [name, setName] = useState<string>("kang");

  useEffect(() => {
    console.log("age: ", age);
    console.log("name: ", name);

  }, [age]);

  
  function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  } 

  const test = async () => {
    
    console.log("test");

    setAge(2);
    //await delay(1000);
    setName("lee");

    console.log("test end");

  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
    >
      <Button
            size={["sm", "md"]}
            colorScheme="orange"
            onClick={test}
            w="100%"
            mt="2"
          >
          test
        </Button>
    </Flex>
    
    
  )
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Test;
