import { Grid, GridItem, Image } from "@chakra-ui/react";
import logo from "../assets/logo/png/d-3po-high-resolution-logo-white-transparent.png";
import HeaderUserInfo from "./HeaderUserInfo";

function Header() {
  return (
    <Grid templateColumns="repeat(8, 1fr)" templateRows="1" className="app-header">
      <GridItem pl={20} colSpan={1} className="header-logo">
        <Image src={logo} />
      </GridItem>
      <GridItem colSpan={6}></GridItem>
      <GridItem colSpan={1} pr={20} textAlign="right">
        <HeaderUserInfo />
      </GridItem>
    </Grid>
  );
}

export default Header;
