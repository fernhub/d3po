import { Grid, GridItem, Heading } from "@chakra-ui/react";
import Header from "./Header";

export default function UnauthLayout() {
  return (
    <Grid
      templateColumns="repeat(10, 1fr)"
      templateRows="repeat(20, 1fr)"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
      className="layout">
      <GridItem rowSpan={2} colSpan={10} pl="2" pt="2" className="header">
        <Header />
      </GridItem>
      <GridItem rowSpan={18} colSpan={10} backgroundColor="black">
        <div className="demo">Placeholder</div>
        <Heading className="home-heading">
          Get help interpreting your documents, minus the headache of switching LLMs
        </Heading>
      </GridItem>
    </Grid>
  );
}
