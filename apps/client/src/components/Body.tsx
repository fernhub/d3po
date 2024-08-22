import ChatContainer from "./ChatContainer";
import FileUploadContainer from "./FileUploadContainer";

interface BodyProps {
  fileSelected: boolean;
}

export default function Body({ fileSelected }: BodyProps) {
  return fileSelected ? <ChatContainer /> : <FileUploadContainer />;
}
