import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./app/index.css";
import { ChakraProvider } from "@chakra-ui/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </StrictMode>
);
