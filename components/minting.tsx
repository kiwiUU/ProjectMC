import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Divider, Flex, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Stack, StackDivider, Text, ToastId, useColorMode, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";
import { FC } from "react";

const Minting: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newNFT, setNewNFT] = useState<any>(undefined);
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract>();
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);
  const toast = useToast();
  const toastIdRef = React.useRef<ToastId>();
  
  const titleImage = "title_sm.png";
  const loadingImage = "loading2.png";
  const mintPrice = '0.1';

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

            window.ethereum.on('chainChanged', function (chainId) {
              console.log(`chainChanged`);
              console.log(`chainId: `, chainId);

              window.location.reload();

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

    if (typeof window.ethereum !== "undefined") { 
      try {
        const accounts = await web3!.eth.requestAccounts();

        console.log('accounts: ', accounts);

        setAccount(accounts[0]);

        const totalSupply = await contract!.methods.totalSupply().call();

        // todo: 9800으로 변경
        if (totalSupply >= 9800) {
          setIsSoldOut(true);
        }

      } catch (error) {
          console.log(error);
      } 
    } else {
      toast({
        title: '',
        description: "Please reload after installing metamask.",
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
    }
    
  };

  const onClickMint = async () => {

    try {
        // todo: 5에서 0.1eth로 변경
        //const mintPriceWei = web3!.utils.toWei(mintPrice, 'ether');
        const mintPriceWei = "5";
        console.log('mintPriceWei: ', mintPriceWei);

        const networkId = await web3!.eth.net.getId(); 

        console.log('networkId: ', networkId);

        // todo: 프로덕션에서 4에서 1로 변경
        if (networkId != 4) {
          toast({
            title: '',
            description: "You are connected to the wrong network.",
            status: 'error',
            duration: 4000,
            isClosable: true,
          });

          return;
        }
        
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
                value: mintPriceWei
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
        <Button onClick={connectWallet} size={["md"]} colorScheme="teal" mt={10} textStyle="Symtext">
          Connect to metamask
        </Button>
      ) : (
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton isActive={isOpen} as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal" mt={10} size={["md"]}>
                <Box w={"200px"} textOverflow="ellipsis" overflow={"hidden"}>
                  {account}
                </Box>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setAccount("")}>Disconnect</MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      )}
      {isSoldOut ? (
        <Text textStyle="Symtext" fontSize={["3xl"]} color="orange.600" py={20}>Sold Out</Text>
      ) : (
        <Flex mt="8" mb="2" justifyContent="center" flexDir={["column"]}>
          <Flex
            justifyContent="center"
            alignItems="end"
          >
            {newNFT ? (
              <Image
                src={newNFT.image}
                fallbackSrc={`../images/${loadingImage}`}
                shadow="lg"
                rounded={"md"}
                alt="nft"
              />
            ) : (
              <Image
                src={`../images/${loadingImage}`}
                shadow="lg"
                rounded={"md"}
                alt="loading"
              />
            )}
          </Flex>
          <Flex 
              flexDir="column" 
              fontSize={["sm", "sm", "md"]}
              px={2}
              py={2}
            >
              <Flex direction="row" justifyContent="space-between">
                <Stack direction="column" spacing={0}>
                  <Text color="gray.600" as='cite'>price</Text>
                  <Stack direction="row" spacing={2}>
                    <Image src={`../images/ether.svg`} w={"12%"}/>
                    <Text fontWeight="bold" fontSize={"md"}>0.1 ETH</Text>
                  </Stack>
                </Stack >
                <Stack direction="column" spacing={0}>
                  <Text color="gray.600" as='cite'>total</Text>
                  <Text fontWeight="bold" fontSize={"md"}>{totalSupply} / 9,800</Text>
                </Stack >
              </Flex>
              <Button
                  size={["sm", "md"]}
                  colorScheme="orange"
                  onClick={onClickMint}
                  disabled={account === "" || isLoading}
                  isLoading={isLoading}
                  loadingText="Loading ..."
                  w="100%"
                  mt="2"
                >
                MINT
              </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Minting;
