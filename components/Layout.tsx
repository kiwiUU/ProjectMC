import { Box, Image } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      bgGradient='linear(to-b, cyan.600, orange.300, orange.400)'
      overflow='hidden'
      px={6}
    >
      <Header />
      {children}  
    </Box>
  );
};

export default Layout;
