import { AddIcon, ChevronDownIcon, EmailIcon, MinusIcon, SearchIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Divider, Flex, HStack, IconButton, Image, Input, Menu, MenuButton, MenuItem, MenuList, Progress, Stack, StackDivider, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, ToastId, Tr, useColorMode, useNumberInput, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "web3Config";
import { FC } from "react";
import { BigNumber, ethers } from "ethers";

const Minting: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newNFT, setNewNFT] = useState<any>(undefined);
  const [contract, setContract] = useState<ethers.Contract>();
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [balance, setBalance] = useState<number>(0);
  const [isMint, setIsMint] = useState<boolean>(false);
  const toast = useToast();

  const titleImage = "title_sm.png";
  const loadingImage = "dead.png";

  // update 
  const mintPrice = '0.1';
  const preMintPrice = '0.05';
  const maxMintCount = 3;

  // todo: 프로덕션에서 5에서 1로 변경
  const networkId = 5;

  // todo: 9800으로 변경
  const totalItems = 9800;

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: maxMintCount,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

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

      const balance = await contract.balanceOf(account);
      setBalance(balance.toNumber());

      const availabeBalance = maxMintCount - balance.toNumber();

      const isMint = availabeBalance > 0 ? true : false;
      setIsMint(isMint);
    } 
  }

  useEffect(() => {
    if (account) {
      console.log("update");
      update();
    } else {
      console.log("not update");

      setTotalSupply(0);
      setBalance(0);
      setIsMint(false);
    }

  }, [account]);

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

  const onClickMint = async () => {

    try {

        // todo: 5에서 0.1eth로 변경
        //const mintPriceWei = ethers.utils.parseEther(mintPrice);
        const mintPriceWei = BigNumber.from("5");

        const isNetwork = await networkCheck();

        if (!isNetwork) {
          return;
        }

        const mintCount = input["aria-valuenow"]!;
        const availabeMintCount = maxMintCount - balance;

        if (mintCount > availabeMintCount || mintCount < 1) {
          toast({
            title: '',
            description: "The maximum number of minting has been exceeded.",
            status: 'error',
            duration: 4000,
            isClosable: true,
          });

          return;
        }

        setIsLoading(true);

        // 민팅 가격(value)
        const tx = await contract?.batchMintNFT(mintCount, { value: mintPriceWei.mul(mintCount) });
        console.log("tx: ", tx);

        const receipt = await tx.wait();
        console.log("receipt: ", receipt);

        if (receipt?.status) {
          const balance = await contract?.balanceOf(account);
          console.log("balance: ", balance);

          if (balance.toNumber()) {

            const myNewNFT = await contract?.tokenOfOwnerByIndex(account, balance.toNumber() - 1);
            console.log("myNewNFT: ", myNewNFT);
  
            if (myNewNFT) {
              const tokenURI = await contract?.tokenURI(myNewNFT);
              console.log("tokenURI: ", tokenURI);
  
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

      //const recover = await contract?.recoverSigner(messageHash, signature);
      //console.log("Message was signed by: ", recover.toString());

      const isMint = await contract?.signatureUsed(signature);

      console.log("isMint: ", isMint);

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
        const balanceOf = await contract?.balanceOf(account);
        console.log("balanceOf: ", balanceOf);

        if (balanceOf) {

          const myNewNFT = await contract?.tokenOfOwnerByIndex(account, balanceOf - 1);
          console.log("myNewNFT: ", myNewNFT);


          if (myNewNFT) {
            const tokenURI = await contract?.tokenURI(myNewNFT);
            console.log("tokenURI: ", tokenURI);


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

  const test = () => {
    console.log("test");

    const a = BigNumber.from(1);

    console.log("a: ", a);


    if (a) {
      console.log(true);
    } else {
      console.log(false);

    }
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
                    <Text fontWeight="bold" fontSize={"lg"}>0.1 ETH</Text>
                  </Stack>
                </Flex>
                <Progress value={(totalSupply / totalItems) * 100} mt={4}/>
                <Flex direction="row" justifyContent="space-between" mt={1}>
                  <Text color="gray.600" as='cite' fontSize={"sm"}>Total</Text>
                  <Text fontSize={"sm"}>{totalSupply} / {totalItems}</Text>
                </Flex >
                <Progress value={(balance / maxMintCount) * 100} mt={4}/>
                <Flex direction="row" justifyContent="space-between" mt={1}>
                  <Text color="gray.600" as='cite' fontSize={"sm"}>Balance</Text>
                  <Text fontSize={"sm"}>{balance} / {maxMintCount}</Text>
                </Flex >
              </Flex>
              <HStack mt={"4"}>
                <IconButton {...inc} aria-label='AddIcon' icon={<AddIcon />} colorScheme="gray" size={["sm", "md"]} />
                <Input {...input} variant='filled' readOnly={true} textAlign="center" size={["sm", "md"]} />
                <IconButton {...dec} aria-label='MinusIcon' icon={<MinusIcon />} colorScheme="gray" size={["sm", "md"]} />
              </HStack>
              <Button
                  size={["sm", "md"]}
                  colorScheme="orange"
                  onClick={onClickMint}
                  disabled={account === "" || !isMint || isLoading}
                  isLoading={isLoading}
                  loadingText="Loading ..."
                  w="100%"
                  mt="2"
                >
                MINT
              </Button>
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
        </Flex>
      )}
    </Flex>
  );
};

export default Minting;
