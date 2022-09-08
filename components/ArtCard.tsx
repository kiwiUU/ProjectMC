import { Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import { FC } from "react";

interface ArtCardProps {
  name: string;
  image: string;
}

const ArtCard: FC<ArtCardProps> = ({
  name,
  image,
}) => {
  return (
    <Flex
      w={["90%"]}
      py={2}
    >
      <Image src={`../images/${image}`} alt={name} rounded="md"/>
    </Flex>
  );
};

export default ArtCard;
