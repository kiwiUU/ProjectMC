import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Text, useColorMode } from "@chakra-ui/react";
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
    <AccordionItem borderColor="orange.600" borderTopWidth={"2px"}>
      <AccordionButton _expanded={{ bg: 'orange.400', color: 'black' }} py={["3", "4"]}>
          <Box flex='1' textAlign='left'>
            <Text fontSize={["lg", "2xl"]} fontWeight="bold">
              {title}
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      <AccordionPanel py={["4", "6"]}>
        <Text fontSize={["md", "xl"]} whiteSpace="pre-wrap">
           {description}
        </Text>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default QuestionCard;
