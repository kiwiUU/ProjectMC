import { Box, Button, Flex, HStack, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, useColorMode } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

const raceConfig = [
  {
    name: "Apple",
    color: "red",
    image: "appleFace.gif"
  },
  {
    name: "Blueberry",
    color: "purple",
    image: "blueberryFace.gif"
  },
  {
    name: "Candy",
    color: "pink",
    image: "candyFace.gif"
  },
  {
    name: "Watermelon",
    color: "teal",
    image: "watermelonFace.gif"
  },
  {
    name: "Cream",
    color: "gray",
    image: "creamFace.gif"
  },
  {
    name: "Pumpkin",
    color: "orange",
    image: "pumpkinFace.gif"
  },
  {
    name: "Grape",
    color: "blue",
    image: "grapeFace.gif"
  },
]

const Story: FC = () => {
  const { t } = useTranslation("common");
  const [image, setImage] = useState(raceConfig[0].image);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      mt={[100, 220]}
    >
      <Flex
        w={["full", "80%", "80%", "50%"]}
        justifyContent="center"
        alignItems="center"
        flexDir={["column", "column", "column", "row"]}
      >
          <Box>
            <Text fontWeight="bold" fontSize={["xl", "5xl"]} color="blue.500" textStyle="Symtext" lineHeight={["base", "shorter"]}>{t("descriptionTitle")}</Text>
            <Text mt={4} fontSize={["lg", "xl"]}>{t("description")}</Text>
            {raceConfig.map((v, i) => (
                <Button key={i} variant='solid' colorScheme={v.color} onClick={() => setImage(v.image)} mr={2} mt={[2, 4]} size={["sm", "md"]}>
                  {v.name}
                </Button>
              ))}
          </Box>
          <Image src={`../images/${image}`} w={["80%", "80%", "60%", "30%"]} ml={[0, 12]} mt={[10, 10, 14, 0]} alt="bandage" shadow="lg" rounded="md"/>
      </Flex>
    </Flex>
  );
};

export default Story;
