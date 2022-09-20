import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { FC, useState } from "react";

// @ 타이틀 이미지는 이미지에 마우스를 올리면 Gif 이미지가 나오도록 하였습니다. public/images 교체하셔서 사용하시면 됩니다.
const titleImage = "title.png";

const Title: FC = () => {

  return (
    <Flex
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      w="full"
    >
      <Box position="relative">   
        <Image
          src={`../images/${titleImage}`}
          alt="title"
        />
      </Box>
      <Text fontSize={["xl", "2xl"]} textStyle="Symtext" mt={"16"} color="orange.600">
          coming soon
      </Text>
    </Flex>
  );
};

export default Title;
