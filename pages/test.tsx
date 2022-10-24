import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Flex, HStack, Image, Input, Tab, TabList, TabPanel, TabPanels, Tabs, useNumberInput } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers, Signer } from "ethers";
import { setInterval } from "timers/promises";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";

const Test: NextPage = () => {

  const test1 = async () => {
    const data = await fetch("/api/crypto/0xaa");
    const result = await data.json();

    console.log("result: ", result);
  }

  const test2 = async () => {
    const keccak256 = ethers.utils.keccak256("0xfe1E7Dc29512C1F351753753D7c9F2181dbCb465");
    
    console.log("keccak256: ", keccak256);
  }


  return (
    <Flex
      justifyContent="center"
      alignItems="center"
    >
      <Button
          size={["sm", "md"]}
          colorScheme="orange"
          onClick={test1}
          w="100%"
          mt="4"
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
