import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, IconButton, Image, Text, useColorMode, useToast } from "@chakra-ui/react";
import axios from "axios";
import { MINT_NFT_ADDRESS } from "caverConfig";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";

const Minting: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newNFT, setNewNFT] = useState<any>(undefined);
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract>();
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const toast = useToast();

  const titleImage = "title_sm.png";
  const loadingImage = "loading.png";

  const mintPrice = 5;

  //console.log('Minting: ', account);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") { 
        try {
            console.log('useEffect');

            const web3 = new Web3(window.ethereum as any);
            setWeb3(web3);

            const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            setContract(contract);

            window.ethereum.on('accountsChanged', function (accounts) {
              console.log(`accountsChanged`);
              console.log(`change accounts: `, accounts);

              const changedAccounts = accounts as Array<string>;
              const account = changedAccounts.length > 0 ? changedAccounts[0] : "";
              
              setAccount(account);
            });

            const fetchData = async (contract: Contract) => {
              const totalSupply = await contract!.methods.totalSupply().call();
              setTotalSupply(totalSupply);
            };

            fetchData(contract);
            
        } catch (error) {
            console.log(error);
        }
    }
  }, []);

  const connectWallet = async () => {
    console.log('connectWallet');

    try {
        const accounts = await web3!.eth.requestAccounts();

        console.log('accounts: ', accounts);

        setAccount(accounts[0]);
    } catch (error) {
        console.log(error);
    } 
  };

  const onClickMint = async () => {

    try {
        
        const isMint = await contract?.methods.mintList(account).call();

        if (isMint) {
          toast({
            title: '',
            description: "You have already minted.",
            status: 'error',
            duration: 4000,
            isClosable: true,
          });

          return;
        }

        console.log("isMint: ", isMint);
       
        setIsLoading(true);

        // 민팅 가격(value), gasPrice, gas
        const response =  await contract!.methods.mintNFT().send({
                from: account,
                value: mintPrice
            });

        console.log('response: ', response);

        if (response?.status) {
          const balanceOf = await contract?.methods
          .balanceOf(account)
          .call();

          console.log('balanceOf: ', balanceOf);

          if (balanceOf) {

            const myNewNFT = await contract?.methods
              .tokenOfOwnerByIndex(account, balanceOf - 1)
              .call();

            console.log('myNewNFT: ', myNewNFT);
  
            if (myNewNFT) {
              const tokenURI = await contract?.methods
                .tokenURI(myNewNFT)
                .call();

              console.log('tokenURI: ', tokenURI);
  
              if (tokenURI) {
                const imageResponse = await axios.get(tokenURI);
  
                if (imageResponse.status === 200) {
                  setNewNFT(imageResponse.data);

                  supply();
                  console.log('mint success');
                }
              }
            }
          }
        }

        setIsLoading(false);

    } catch (error) {
        console.log(error);
        setIsLoading(false);
    }
  };

  const supply = async () => {
    const totalSupply = await contract!.methods.totalSupply().call();

    console.log('totalSupply:', totalSupply);

    setTotalSupply(totalSupply);
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      {account === "" ? (
        <Button onClick={connectWallet} size={["sm", "md"]} colorScheme="orange" mt={14}>
          Connect to metamask
        </Button>
      ) : (
        <Flex flexDir="column" justifyContent="center" alignItems="center" mt={14}>
          <Text fontSize={["md", "xl"]} color="yellow.700" overflowWrap="anywhere" noOfLines={1}>
            {account}
          </Text>
          <Button onClick={() => setAccount("")} colorScheme="orange" size={["sm", "md"]} mt="2">
            Disconnect
          </Button>
        </Flex>
      )}
      <Flex mt="8" justifyContent="center" flexDir={["column"]} mb="30px">
        <Flex
          justifyContent="center"
          alignItems="center"
        >
          {newNFT ? (
            <Image
              src={newNFT.image}
              fallbackSrc={`../images/${loadingImage}`}
              shadow="lg"
              alt="nft"
            />
          ) : (
            <Image
              src={`../images/${loadingImage}`}
              shadow="lg"
              alt="loading"
            />
          )}
        </Flex>
        <Flex 
            bgColor="orange.500" 
            direction="column" 
            justifyContent="space-around" 
            alignItems="center"
            mt={2}
          >
            <Flex direction="column" fontSize={["sm", "sm", "md"]} py="2">
              <Text textAlign="start" fontWeight="bold" color="yellow.300">Price</Text>
              <Text textAlign="start">0.1 ETH + gas</Text>
              <Text textAlign="start" fontWeight="bold" mt={3} color="yellow.300">maximum mints</Text>
              <Text textAlign="start">1 mint / wallet</Text>
              <Text textAlign="start" fontWeight="bold" mt={3} color="yellow.300">supply</Text>
              <Text textAlign="start">{totalSupply} / 10000</Text>
              <Button
                size={["sm", "lg"]}
                colorScheme="green"
                onClick={onClickMint}
                disabled={account === "" || isLoading}
                isLoading={isLoading}
                loadingText="Loading ..."
                mt="4"
              >
                Mint
              </Button>
            </Flex> 
        </Flex>
      </Flex>
    </Flex>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Minting;
