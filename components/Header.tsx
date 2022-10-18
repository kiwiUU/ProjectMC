import { FC } from "react";
import { useRouter } from "next/router";
import { Box, Button, Flex, Image, useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { FaDiscord, FaInstagram, FaTwitter } from "react-icons/fa";
import { IoMoon, IoSunny } from "react-icons/io5";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import MintingNFT from "./MintingNFT";
import PreMintingNFT from "./PreMintingNFT";

// @ 로고 이미지는 public/images를 교체하시면 됩니다. URL은 우리 프로젝트의 URL을 작성하시면 됩니다.
const logoImage = "logo.png";
const logoImageDark = "logo_white.png";
const openseaURL = "https://testnets.opensea.io/collection/projectlion-nft";
const discordURL = "https://discord.gg/JV4whBWNPs";
const instagramURL = "https://www.instagram.com/projectlion.io/";
const twitterURL = "https://twitter.com/MummyCandyNFT";
const mintURL = "minting";


const Header: FC = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Flex
        position="fixed"
        w="100%"
        h="5%"
        top="0"
        justifyContent="end"
        alignItems="center"
        px={8}
        flexDir="row"
      >
        <Flex alignItems="center">
          {/* <Button colorScheme="orange" size={["xs", "xs", "sm"]} mr={2} onClick={onOpen}>
            mint
          </Button>
          <Link href={openseaURL}>
            <Button variant="ghost" size={["xs", "xs", "sm"]}>
              <Image src="../images/opensea.png" alt="opensea" w={6} />
            </Button>
          </Link> */}
          <Link href={twitterURL}>
            <Button variant="ghost" size={["xs", "xs", "sm"]}>
              <FaTwitter size={24} />
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={["xs"]}>
        <ModalOverlay />
        <ModalContent 
          bg="gray.300"
          //bgGradient='linear(to-b, cyan.400, orange.300)'
        >
          <ModalCloseButton />
          <ModalBody>
            <PreMintingNFT />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
    
 
  );
};

export default Header;
