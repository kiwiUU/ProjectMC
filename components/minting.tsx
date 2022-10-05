import { AddIcon, ChevronDownIcon, EmailIcon, MinusIcon, SearchIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Divider, Flex, HStack, IconButton, Image, Input, Menu, MenuButton, MenuItem, MenuList, Stack, StackDivider, Text, ToastId, useColorMode, useNumberInput, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";
import { FC } from "react";
import { BigNumber, ethers } from "ethers";

const Minting: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newNFT, setNewNFT] = useState<any>(undefined);
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const toast = useToast();
  const toastIdRef = React.useRef<ToastId>();
  
  const titleImage = "title_sm.png";
  const loadingImage = "dead.png";
  const mintPrice = '0.1';
  const preMintPrice = '0.05';

  useEffect(() => {

    if (typeof window.ethereum !== "undefined") { 
        try {
          
          const provider = new ethers.providers.Web3Provider(window.ethereum as any);
          setProvider(provider);

          const signer = provider.getSigner();
          setSigner(signer);

          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contract);

          window.ethereum.on('accountsChanged', function (accounts) {
            const changedAccounts = accounts as Array<string>;
            const account = changedAccounts.length > 0 ? changedAccounts[0] : "";

            setAccount(account);

          });

          window.ethereum.on('chainChanged', function (chainId) {
            window.location.reload();
          });

          // const fetchData = async (contract: ethers.Contract) => {
          //   const totalSupply = await contract.totalSupply();

          //   setTotalSupply(totalSupply.toNumber());
          // };

          // fetchData(contract);
            
        } catch (error) {
            console.log(error);
        }
    }
  }, []);

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
        setTotalSupply(totalSupply.toNumber());

        // todo: 9800으로 변경
        if (totalSupply.toNumber() >= 9800) {
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
        //const mintPriceWei = ethers.utils.parseEther(mintPrice);
        const mintPriceWei = BigNumber.from("5");

        const isNetwork = await networkCheck();

        if (!isNetwork) {
          return;
        }
        
        const isMint = await contract?.isMintListAddress(account);

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
        const tx = await contract?.mintNFT({ value: mintPriceWei });
        const receipt = await tx.wait();

        if (receipt?.status) {
          const balanceOf = await contract?.balanceOf(account);

          if (balanceOf) {

            const myNewNFT = await contract?.tokenOfOwnerByIndex(account, balanceOf - 1);
  
            if (myNewNFT) {
              const tokenURI = await contract?.tokenURI(myNewNFT);
  
              if (tokenURI) {
                const imageResponse = await axios.get(tokenURI);
  
                if (imageResponse.status === 200) {
                  setNewNFT(imageResponse.data);
                  supply();
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

  const onClickPreSale =async () => {

    try {

      // todo: 3에서 0.05eth로 변경
      //const preMintPriceWei = ethers.utils.parseEther(preMintPrice);
      const preMintPriceWei = BigNumber.from("3");

      const isNetwork = await networkCheck();

      if (!isNetwork) {
        return;
      }

      // Define a list of allowlisted wallets
      const allowlistedAddresses= require('allowlist.json'); 

      // Select an allowlisted address to mint NFT
      const selectedAddress = await signer?.getAddress();

      // Define wallet that will be used to sign messages
      const walletAddress = '0xfe1E7Dc29512C1F351753753D7c9F2181dbCb465';
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
      const owner = new ethers.Wallet(privateKey!);

      let messageHash, signature;

      // Check if selected address is in allowlist
      // If yes, sign the wallet's address
      if (allowlistedAddresses.includes(selectedAddress)) {
        // Compute message hash
        messageHash = ethers.utils.id(selectedAddress!);

        // Sign the message hash
        let messageBytes = ethers.utils.arrayify(messageHash);
        signature = await owner.signMessage(messageBytes);
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

      setIsLoading(true);

      //const recover = await contract?.recoverSigner(messageHash, signature);
      //console.log("Message was signed by: ", recover.toString());

      // 민팅 가격(value)
      const tx = await contract?.preSaleOffChain(messageHash, signature, { value: preMintPriceWei });
      const receipt = await tx.wait();

      if (receipt?.status) {
        const balanceOf = await contract?.balanceOf(account);

        if (balanceOf) {

          const myNewNFT = await contract?.tokenOfOwnerByIndex(account, balanceOf - 1);

          if (myNewNFT) {
            const tokenURI = await contract?.tokenURI(myNewNFT);

            if (tokenURI) {
              const imageResponse = await axios.get(tokenURI);

              if (imageResponse.status === 200) {
                setNewNFT(imageResponse.data);
                supply();
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
    const totalSupply = await contract?.totalSupply();
    setTotalSupply(totalSupply.toNumber());
  }

  const networkCheck = async () => {

    const { chainId } = await provider!.getNetwork();

    // todo: 프로덕션에서 5에서 1로 변경
    if (chainId != 5) {
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
                <MenuItem onClick={() => setAccount("")}>Disconnect</MenuItem>
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
              {/* <HStack mt={"2"}>
                <IconButton {...inc} aria-label='AddIcon' icon={<AddIcon />} colorScheme="orange" size={["sm", "md"]} />
                <Input {...input} variant='outline' readOnly={true} textAlign="center" size={["sm", "md"]} borderColor="gray.200" />
                <IconButton {...dec} aria-label='MinusIcon' icon={<MinusIcon />} colorScheme="orange" size={["sm", "md"]} />
              </HStack> */}
              <Button
                  size={["sm", "md"]}
                  colorScheme="orange"
                  onClick={onClickPreSale}
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
