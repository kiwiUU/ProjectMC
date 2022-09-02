import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import React, { FC } from "react";

interface QuestionCardProps {
  justifyContent: string;
  title: string;
  description: string;
}

const QuestionCard: FC<QuestionCardProps> = ({
  justifyContent,
  title,
  description,
}) => {

  return (
    <Flex
      w="100%"
      justifyContent={justifyContent}
    >
      <Flex
        w={["full", "full", "60%", "50%"]}
        m={2}
        px={4}
        py={2}
        justifyContent="center"
        flexDir="column"
        shadow="lg"
        bgColor="yellow.500"
      >
        <Text fontSize={["sm", "md", "lg"]} fontWeight="bold">
          {title}
        </Text>
        <Text mt={2} fontSize={["xs", "sm", "md"]}>
          {description}
        </Text>
      </Flex>
    </Flex>
  );
};

export default QuestionCard;
