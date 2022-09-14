import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import ArtCard from "./ArtCard";

const artCardConfig = [
  {
    name: "1",
    image: "mummy1.gif",
  },
  {
    name: "2",
    image: "mummy2.gif",
  },
  {
    name: "3",
    image: "mummy3.gif",
  },
  {
    name: "4",
    image: "mummy4.gif",
  },
  {
    name: "5",
    image: "mummy5.gif",
  },
  {
    name: "6",
    image: "mummy6.gif",
  },
  {
    name: "7",
    image: "mummy7.gif",
  },
  {
    name: "8",
    image: "mummy8.gif",
  },
  {
    name: "9",
    image: "mummy9.gif",
  },
];

const storyConfig = [
  {
    mt: 0,
    title: "storyTitle1",
    description: "story1",
  }
];

const Art: FC = () => {
  const { t } = useTranslation("common");

  return (
    <Flex alignItems="center" justifyContent="center">
      <Flex
        w={["full", "80%", "80%", "50%"]}
        justifyContent="center"
        alignItems="center"
        flexDir={["column", "column", "column", "row"]}
      >
        <Grid
          placeItems="center"
          templateColumns={[
            "repeat(3, 1fr)",
          ]}
          w={["full", "full", "full", "50%"]}
        >
          {artCardConfig.map((v, i) => {
            return (
              <ArtCard
                key={i}
                name={v.name}
                image={v.image}
              />
            );
          })}
        </Grid>
        <Flex
          w={["full", "full", "full", "50%"]}
          justifyContent="center"
          alignItems="center"
          ml={[0, 12]}
        >
          <Box
            py={8}
          >
            {storyConfig.map((v, i) => {
              return (
                <Box key={i} mt={v.mt}>
                  <Text fontWeight="bold" fontSize={["xl", "5xl"]} color="red.500" textStyle="Symtext">{t(v.title)}</Text>
                  <Text mt={4} fontSize={["lg", "xl"]}>{t(v.description)}</Text>
                </Box>
              );
            })}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Art;
