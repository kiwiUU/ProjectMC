import { Flex, Text, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

// @ 팀 주소 및 카피라이트에 관한 정보를 입력합니다.
const contactInfo =
  "Team ProjectLion NFT | 443, Teheran-ro, Gangnam-gu, Seoul, Republic of Korea | E-Mail h662@olbm.app";
const copyRight = "© 2022 Mummy Candy";

const Footer: FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      p={[4, 4, 2]}
      bgColor="yellow.600"
      mx={-6}
    >
      {/* <Text fontSize={["xs", "xs", "sm"]}>{contactInfo}</Text> */}
      <Text fontSize={["xs", "md"]} mt={1}>
        {copyRight}
      </Text>
    </Flex>
  );
};

export default Footer;
