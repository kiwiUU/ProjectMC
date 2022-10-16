import { Button, Flex, HStack, Image, Link, Text, useColorMode, VStack } from "@chakra-ui/react";
import { FC } from "react";

// @ 팀 주소 및 카피라이트에 관한 정보를 입력합니다.
const contactInfo =
  "Team ProjectLion NFT | 443, Teheran-ro, Gangnam-gu, Seoul, Republic of Korea | E-Mail h662@olbm.app";
const copyRight = "© 2022 Mummy Candy";

const Footer: FC = () => {
  const license = "http://creativecommons.org/licenses/by-sa/4.0/";

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      p={[4, 4, 2]}
      bgColor="yellow.600"
      mx={-6}
      mt={["32", "40"]}
    >
      <Link href={license} isExternal>
        <Image src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"/>
      </Link>
      <Text>This work is licensed under a{' '}
        <Link href={license} color='green.900' isExternal>
          <Text as='u'>Creative Commons Attribution-ShareAlike 4.0 International License</Text>
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
