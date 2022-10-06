import { AddIcon, ChevronDownIcon, EmailIcon, MinusIcon, SearchIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Divider, Flex, HStack, IconButton, Image, Input, Menu, MenuButton, MenuItem, MenuList, Progress, Stack, StackDivider, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, ToastId, Tr, useColorMode, useNumberInput, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
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

          window.ethereum.on('chainChanged', function (chainId) {
            window.location.reload();
          });

          return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
          }

        } catch (error) {
            console.log(error);
        }
    }
    
  }, []);

  useEffect(() => {
    const update = async () => {
      if (contract && account) {
        const totalSupply = await contract?.totalSupply();
        setTotalSupply(totalSupply.toNumber());

        const balance = await contract?.balanceOf(account);
        setBalance(balance.toNumber());

      } else {
        setTotalSupply(0);
        setBalance(0);
      }
      
    }

    update();

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
        setTotalSupply(totalSupply.toNumber());

        const balance = await contract?.balanceOf(account);
        setBalance(balance.toNumber());

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
    setTotalSupply(0);
    setBalance(0);

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
                <Progress value={(totalSupply / 9800) * 100} mt={4}/>
                <Flex direction="row" justifyContent="space-between" mt={1}>
                  <Text color="gray.600" as='cite' fontSize={"sm"}>Total</Text>
                  <Text fontSize={"sm"}>{totalSupply} / 9,800</Text>
                </Flex >
                <Progress value={(balance / 5) * 100} mt={4}/>
                <Flex direction="row" justifyContent="space-between" mt={1}>
                  <Text color="gray.600" as='cite' fontSize={"sm"}>Balance</Text>
                  <Text fontSize={"sm"}>{balance} / 5</Text>
                </Flex >
              </Flex>
              
              
              {/* <TableContainer mt={4}>
                <Table variant='simple' size='sm' colorScheme={"yellow"}>
                  <TableCaption>Imperial to metric conversion factors</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>To convert</Th>
                      <Th>into</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td ><Text color="gray.600" as='cite'>price</Text></Td>
                      <Td isNumeric><Text fontWeight="bold" fontSize={"sm"}>0.1 ETH</Text></Td>
                    </Tr>
                    <Tr>
                      <Td><Text color="gray.600" as='cite'>total</Text></Td>
                      <Td isNumeric><Text fontWeight="bold" fontSize={"sm"}>{totalSupply} / 9,800</Text></Td>
                    </Tr>
                    <Tr>
                      <Td><Text color="gray.600" as='cite'>balance</Text></Td>
                      <Td isNumeric><Text fontWeight="bold" fontSize={"sm"}>1 / 5</Text></Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer> */}
              <HStack mt={"4"}>
                <IconButton {...inc} aria-label='AddIcon' icon={<AddIcon />} colorScheme="gray" size={["sm", "md"]} />
                <Input {...input} variant='filled' readOnly={true} textAlign="center" size={["sm", "md"]} />
                <IconButton {...dec} aria-label='MinusIcon' icon={<MinusIcon />} colorScheme="gray" size={["sm", "md"]} />
              </HStack>
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
