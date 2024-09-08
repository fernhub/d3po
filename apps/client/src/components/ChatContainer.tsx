import { selectedDocumentAtom } from "../state/documents";
import { useAtom } from "jotai";
import { selectedModelAtom } from "../state/selectedModel";
import { ChatWindow } from "./ChatWindow";
import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

// type ChatContainerProps = {
//   selectedDocument: Document | null;
//   selectedModel: Model | null;
// };

export default function ChatContainer() {
  const [selectedDocument] = useAtom(selectedDocumentAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    if (selectedDocument !== null && selectedModel !== null) {
      const query = {
        user_id: user?.id,
        document_key: selectedDocument.s3_key,
        model_source: selectedModel.source,
        model_key: selectedModel.key,
      };
      console.log("creating socket");
      console.log(query);
      const sock = io("http://localhost:5001", {
        query: query,
        withCredentials: true,
      });
      sock.on("connect", () => {
        console.log("successfully connected");
      });
      sock.on("ready", () => {
        alert("ready");
      });
      sock.on("connect_error", function (err) {
        //TODO: something with err
        console.log("error on connect");
        console.log(err.message);
      });
      setSocket(sock);
      const cleanupSocket = () => {
        console.log("dismounting and disconnecting socket");
        sock.off();
        sock.disconnect();
      };
      window.addEventListener("beforeunload", cleanupSocket);

      return () => {
        cleanupSocket();
        window.removeEventListener("beforeunload", cleanupSocket);
      };
    } else {
      console.log("missing selected document or model");
    }
  }, [selectedDocument, selectedModel, user]);

  return (
    <div className="chat_container">
      {selectedDocument === null || selectedModel === null || socket === undefined ? (
        <h1>Select a document and model to begin interacting</h1>
      ) : (
        <ChatWindow
          selectedDocument={selectedDocument}
          selectedModel={selectedModel}
          chatSocket={socket}
        />
      )}
    </div>
  );
}
