import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Flex, HStack, Image, Input, Tab, TabList, TabPanel, TabPanels, Tabs, useNumberInput } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers, Signer } from "ethers";
import { setInterval } from "timers/promises";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";

const Test: NextPage = () => {




  return (
    <Flex
      justifyContent="center"
      alignItems="center"
    >
      
    </Flex>
    
    
  )
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Test;
