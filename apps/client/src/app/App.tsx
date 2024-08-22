import { Grid, GridItem } from "@chakra-ui/react";
import "./App.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Body from "../components/Body";
import Footer from "../components/Footer";
function App() {
  // const args = {
  //   ragInitialized: false,
  //   query: "",
  //   response: "",
  // };
  return (
    <Grid
      templateColumns="repeat(10, 1fr)"
      templateRows="repeat(20, 1fr)"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold">
      <GridItem rowSpan={2} colSpan={10} pl="2" pt="2">
        <Header />
      </GridItem>
      <GridItem rowSpan={16} colSpan={2} pl="2" bg="pink.300">
        <Sidebar />
      </GridItem>
      <GridItem rowSpan={16} colSpan={8} bg="green.300">
        <Body fileSelected={true} />
      </GridItem>
      <GridItem pl="2" rowSpan={2} colSpan={10} bg="blue.300">
        <Footer />
      </GridItem>
    </Grid>
  );
}

export default App;
