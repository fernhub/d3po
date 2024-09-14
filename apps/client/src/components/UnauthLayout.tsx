import { Flex, Grid, GridItem, Heading, Spinner } from "@chakra-ui/react";
import Header from "./Header";
import { useAtom } from "jotai";
import { appStateAtom } from "../state/app";
import { useState } from "react";

export default function UnauthLayout() {
  const [appState] = useAtom(appStateAtom);
  const [loadingIframe, setLoadingIframe] = useState(true);
  function hideLoader() {
    setLoadingIframe(false);
  }

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
      <GridItem rowSpan={18} colSpan={10}>
        {appState == "initializing" ? (
          <div className="video_container">
            <Flex className="spinner_container">
              <Spinner size="xl" className="loading_spinner" color="white" />
            </Flex>
          </div>
        ) : (
          <>
            <div className="video_container">
              {loadingIframe && (
                <Flex className="spinner_container">
                  <Spinner size="xl" className="loading_spinner" color="white" />
                </Flex>
              )}
              <iframe
                src="https://www.loom.com/embed/641c7344743f4ab3807feaff0f735c1a?sid=4da0ddf4-09fc-4212-b1bc-094ccf6b95bc&hide_share=true&hideEmbedTopBar=true&hide_title=true&hide_owner=true"
                className="video_frame"
                onLoad={hideLoader}
                style={{
                  width: "100%",
                  minWidth: "100%",
                  height: "85%",
                  minHeight: "85%",
                  marginTop: "5%",
                }}
              />
            </div>
            <Heading className="home-heading">
              Get help interpreting your documents, without the headache of switching LLMs
            </Heading>
          </>
        )}
      </GridItem>
    </Grid>
  );
}
