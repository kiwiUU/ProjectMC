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
      //w={200}
      w={["80%"]}
      py={3}
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      <Image src={`../images/${image}`} w={175} alt={name} />
    </Flex>
  );
};

export default ArtCard;
