import { AddIcon, ChevronDownIcon, EmailIcon, MinusIcon, SearchIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Divider, Flex, HStack, IconButton, Image, Input, Menu, MenuButton, MenuItem, MenuList, Progress, Stack, StackDivider, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, ToastId, Tr, useColorMode, useNumberInput, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";
import { FC } from "react";
import { BigNumber, ethers } from "ethers";

const PreMintingNFT: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newNFT, setNewNFT] = useState<any>(undefined);
  const [contract, setContract] = useState<ethers.Contract>();
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [isMint, setIsMint] = useState<boolean>(false);
  const toast = useToast();

  const loadingImage = "dead.png";

  // update 
  const preMintPrice = '0.05';

  // todo: 프로덕션에서 5에서 1로 변경
  const networkId = 5;

  // todo: 9800으로 변경
  const totalItems = 9800;

  const handleAccountsChanged = async (accounts: any) => {
    console.log("handleAccountsChanged");

    const changedAccounts = accounts as Array<string>;
    const account = changedAccounts.length > 0 ? changedAccounts[0] : "";

    setAccount(account);

  }

  const handleChainChanged = (chainId: any) => {
    window.location.reload();
  } 

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") { 
        try {
          
          const provider = new ethers.providers.Web3Provider(window.ethereum as any);
          setProvider(provider);

          const signer = provider.getSigner();
          setSigner(signer);

          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contract);

          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);

          return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
          }

        } catch (error) {
            console.log(error);
        }
    }
    
  }, []);

  const update = async () => {
    if (contract) {
      const totalSupply = await contract.totalSupply();
      setTotalSupply(totalSupply.toNumber());

      const selectedAddress = await signer?.getAddress();

      // Check if selected address is in allowlist
      // If yes, sign the wallet's address
      const data = await sign(selectedAddress!);
      const success = data.success;

      if (success) {
        const signature = data.signature;
        const signatureUsed = await contract.signatureUsed(signature);

        setIsMint(!signatureUsed);
      } else {
        setIsMint(false);
      }
      
    } 
  }

  useEffect(() => {
    if (account) {
      update();
    } else {
      setTotalSupply(0);
      setIsMint(false);
    }

  }, [account]);

  const sign = async (address: string) => {

    const result = await fetch(`/api/crypto/${address}`);
    let data = await result.json();
    
    return data;
  }

  const connectWallet = async () => {

    if (typeof window.ethereum !== "undefined") { 
      try {

        const isNetwork = await networkCheck();

        if (!isNetwork) {
          return;
        }

        await provider?.send("eth_requestAccounts", []);
        const account = await signer?.getAddress();

        account ? setAccount(account) : setAccount("");

        const totalSupply = await contract?.totalSupply();

        if (totalSupply.toNumber() >= totalItems) {
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

  const onClickPreSale = async () => {

    try {

      // todo: 3에서 0.05eth로 변경
      //const preMintPriceWei = ethers.utils.parseEther(preMintPrice);
      const preMintPriceWei = BigNumber.from("3");

      const isNetwork = await networkCheck();

      if (!isNetwork) {
        return;
      }

      const selectedAddress = await signer?.getAddress();
      let messageHash, signature;

      const data = await sign(selectedAddress!);
      const success = data.success;

      if (success) {
        messageHash = ethers.utils.keccak256(selectedAddress!);
        signature = data.signature;
      } else {
        toast({
          title: '',
          description: "Address is not allowlisted.",
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
  
        return;
      }

      //const recover = await contract?.recoverSigner(messageHash, signature);
      //console.log("Message was signed by: ", recover.toString());

      const isMint = await contract?.signatureUsed(signature);

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

      setIsLoading(true);

      // 민팅 가격(value)
      const tx = await contract?.preSaleOffChain(messageHash, signature, { value: preMintPriceWei });
      const receipt = await tx.wait();

      if (receipt?.status) {
        const balance = await contract?.balanceOf(account);

        if (balance.toNumber()) {

          const myNewNFT = await contract?.tokenOfOwnerByIndex(account, balance - 1);

          if (myNewNFT.toNumber()) {
            const tokenURI = await contract?.tokenURI(myNewNFT);

            if (tokenURI) {
              const imageResponse = await axios.get(tokenURI);

              if (imageResponse.status === 200) {
                setNewNFT(imageResponse.data);
                update();
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

  const networkCheck = async () => {

    const { chainId } = await provider!.getNetwork();

    if (chainId != networkId) {
      toast({
        title: '',
        description: "You are connected to the wrong network.",
        status: 'error',
        duration: 4000,
        isClosable: true,
      });

      return false;
    } 

    return true;
  }

  const disconnect = () => {
    setAccount("");
  }

  const test = async () => {
    await contract?.setNotRevealedURI("https://gateway.pinata.cloud/ipfs/QmPz6P5aPHiCTuu1guysuxtBCb1eY57vuF69Kv8zcKCxhf");
    await contract?.setIsRevealed(false);
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      {account === "" ? (
        <Button onClick={connectWallet} size={["md"]} colorScheme="gray" mt={10} textStyle="Symtext">
          Connect to Wallet
        </Button>
      ) : (
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton isActive={isOpen} as={Button} rightIcon={<ChevronDownIcon />} colorScheme="gray" mt={10} size={["md"]}>
                <Box w={"180px"} textOverflow="ellipsis" overflow={"hidden"}>
                  {account}
                </Box>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={disconnect}>Disconnect</MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      )}
      {isSoldOut ? (
        <Text textStyle="Symtext" fontSize={["3xl"]} color="orange.600" py={20}>Sold Out</Text>
      ) : (
        <Flex mt="8" mb="2" justifyContent="center" flexDir={["column"]} w={["100%"]}>
          <Flex
            justifyContent="center"
            alignItems="center"
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
              py={2}
            >
              <Flex direction="column">
                <Flex direction="column" alignItems="end">
                  <Stack direction="row">
                    {/* <Image src={`../images/ether.svg`} w={"12%"}/> */}
                    <Text fontWeight="bold" fontSize={"lg"}>{preMintPrice} ETH</Text>
                  </Stack>
                </Flex>
                <Progress value={(totalSupply / totalItems) * 100} mt={4}/>
                <Flex direction="row" justifyContent="space-between" mt={1}>
                  <Text color="gray.600" as='cite' fontSize={"sm"}>Total</Text>
                  <Text fontSize={"sm"}>{totalSupply} / {totalItems}</Text>
                </Flex >
              </Flex>
              <Button
                  size={["sm", "md"]}
                  colorScheme="orange"
                  onClick={onClickPreSale}
                  disabled={account === "" || !isMint || isLoading}
                  isLoading={isLoading}
                  loadingText="Loading ..."
                  w="100%"
                  mt="4"
                >
                MINT
              </Button>
              <Button
                  size={["sm", "md"]}
                  colorScheme="orange"
                  onClick={test}
                  w="100%"
                  mt="4"
                >
                test
              </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default PreMintingNFT;
