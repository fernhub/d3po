import { Grid, GridItem, Image } from "@chakra-ui/react";
import logo from "../assets/logo/svg/logo-no-background.svg";
import HeaderUserInfo from "./HeaderUserInfo";

function Header() {
  return (
    <Grid templateColumns="repeat(8, 1fr)" templateRows="1">
      <GridItem pl={20} colSpan={1} alignContent="center">
        <Image src={logo} />
      </GridItem>
      <GridItem colSpan={6} textAlign="center" alignContent="center"></GridItem>
      <GridItem colSpan={1} pr={20} textAlign="right" alignContent="center">
        <HeaderUserInfo />
      </GridItem>
    </Grid>
  );
}

export default Header;
