import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Flex, HStack, Image, Input, Tab, TabList, TabPanel, TabPanels, Tabs, useNumberInput } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers, Signer } from "ethers";
import { setInterval } from "timers/promises";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";

const Test: NextPage = () => {


  const test = async () => {
    console.log("test1");
    
    const data = await fetch("/api/hello/0xfe1E7Dc29512C1F351753753D7c9F2181dbCb465");
    const result = await data.json();
    console.log(result);
    

  };

  const test2 = async () => {
    console.log("test2");
    
    const privateKey = "1111";
    const owner = new ethers.Wallet(privateKey!);

    console.log("owner: ", owner);
    console.log("owner: ", JSON.stringify(owner));

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
        <Button
            size={["sm", "md"]}
            colorScheme="orange"
            onClick={test2}
            w="100%"
            mt="2"
          >
          test2
        </Button>
    </Flex>
    
    
  )
};

export async function getStaticProps() {

  const privateKey = process.env.PRIVATE_KEY;
  const w = new ethers.Wallet(privateKey!);
  const owner = JSON.stringify(w)

  return { props: { owner } }
}

export default Test;
