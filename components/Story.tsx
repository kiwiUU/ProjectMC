import { Box, Button, Flex, HStack, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, useColorMode } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC, useState } from "react";

// @ 이미지는 public/images, 스토리 내용은 public/locales의 json 파일을 각각 수정해서 사용하시면 됩니다.
const storyConfig = [
  {
    mt: 0,
    title: "storyTitle1",
    description: "story1",
  }
];

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
      flexDir="column"
      mt={16}
    >
      <Flex
        w={["full", "full", "60%", "50%"]}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          //mx={8}
          px={4}
          py={8}
        >
          {storyConfig.map((v, i) => {
            return (
              <Box key={i} mt={v.mt}>
                <Text fontWeight="bold" fontSize={["sm", "xl"]}>{t(v.title)}</Text>
                <Text mt={2} fontSize={["sm", "md"]}>{t(v.description)}</Text>
              </Box>
            );
          })}
        </Box>
      </Flex>
      <Flex
        w={["full", "full", "60%", "40%"]}
        justifyContent="center"
        alignItems="center"
        flexDir={["column", "row"]}
        mt="8"
      >
        <Image shadow="lg" src={`../images/${image}`} w={["60%", "40%"]} alt="bandage" />
        
        <Box ml={[0, 10]} mt={[6, 0]}>
          <Text fontWeight="bold" fontSize={["sm", "xl"]}>{t("descriptionTitle")}</Text>
          <Text mt={2} fontSize={["sm", "md"]}>{t("description")}</Text>
          {raceConfig.map((v, i) => (
              <Button key={i} variant='solid' colorScheme={v.color} onClick={() => setIamge(v.image)} mr={2} mt={2} size={["xs", "sm"]}>
                {v.name}
              </Button>
            ))}
        </Box>
    </Flex>
    </Flex>
  );
};

export default Story;
