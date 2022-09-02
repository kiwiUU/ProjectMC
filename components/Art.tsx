import { Box, Flex, Grid } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import ArtCard from "./ArtCard";

// @ name: 아트 이름, image: public/images에 있는 이미지 이름
const artCardConfig = [
  {
    name: "1",
    image: "1.gif",
  },
  {
    name: "2",
    image: "2.gif",
  },
  {
    name: "3",
    image: "3.gif",
  },
  {
    name: "4",
    image: "4.gif",
  },
  {
    name: "5",
    image: "5.gif",
  },
  {
    name: "6",
    image: "6.gif",
  },
  {
    name: "7",
    image: "7.gif",
  },
  {
    name: "8",
    image: "8.gif",
  },
  
];

const Art: FC = () => {
  const { t } = useTranslation("common");

  return (
    <Flex alignItems="center" flexDir="column">
      <Box fontSize={["3xl", "5xl"]} fontWeight="bold">
        {t("art")}
      </Box>
      <Grid
        mt={6}
        // justifyItems="center"
        // alignItems="center"
        placeItems="center"
        templateColumns={[
          // "repeat(1, 1fr)",
          // "repeat(1, 1fr)",
          // "repeat(2, 1fr)",
          "repeat(4, 1fr)",
        ]}
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
    </Flex>
  );
};

export default Art;
