import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Flex, HStack, Image, Input, Tab, TabList, TabPanel, TabPanels, Tabs, useNumberInput } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers, Signer } from "ethers";
import { setInterval } from "timers/promises";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";

interface Props {
  owner: ethers.Wallet;
}

const Test: NextPage<Props> = ({ owner }) => {

  const a = 1;
  const p = process.env.NEXT_PUBLIC_PRIVATE_KEY;

  const test = async () => {
    console.log("test1");
    
  
    console.log("owner: ", owner);

  };

  const test2 = async () => {
    console.log("test2");
    
   

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
  const owner = new ethers.Wallet(privateKey!);
  const j = owner

  return { props: { owner } }
}

export default Test;
