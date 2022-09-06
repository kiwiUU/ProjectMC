import { Box, Button, Flex, HStack, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, useColorMode } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

const raceConfig = [
  {
    name: "apple",
    color: "red",
    image: "appleFace.gif"
  },
  {
    name: "autumn",
    color: "yellow",
    image: "autumnFace.gif"
  },
  {
    name: "blueberry",
    color: "purple",
    image: "blueberryFace.gif"
  },
  {
    name: "candy",
    color: "pink",
    image: "candyFace.gif"
  },
  {
    name: "christmas",
    color: "teal",
    image: "christmasFace.gif"
  },
  {
    name: "cream",
    color: "gray",
    image: "creamFace.gif"
  },
  {
    name: "forest",
    color: "green",
    image: "forestFace.gif"
  },
  {
    name: "halloween",
    color: "orange",
    image: "halloweenFace.gif"
  },
  {
    name: "snack",
    color: "pink",
    image: "snackFace.gif"
  },
  {
    name: "summer",
    color: "cyan",
    image: "summerFace.gif"
  },
  {
    name: "water",
    color: "blue",
    image: "waterFace.gif"
  }
]

const Story: FC = () => {
  const { t } = useTranslation("common");
  const [image, setIamge] = useState(raceConfig[0].image);

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
                <Button key={i} variant='solid' colorScheme={v.color} onClick={() => setIamge(v.image)} mr={2} mt={[2, 4]} size={["sm", "md"]}>
                  {v.name}
                </Button>
              ))}
          </Box>
          <Image src={`../images/${image}`} w={["80%", "80%", "60%", "30%"]} ml={[0, 12]} mt={[8, 8, 8, 0]} alt="bandage" shadow="lg"/>
      </Flex>
    </Flex>
  );
};

export default Story;
