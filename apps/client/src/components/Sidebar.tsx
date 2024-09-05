import { documentApi } from "../utils/documentUtils";
import { type Document } from "shared/schema/document";
import { DocumentsContainer } from "./DocumentsContainer";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { documentsAtom } from "../state/documents";

export default function Sidebar() {
  const [, setDocuments] = useAtom(documentsAtom);

  useEffect(() => {
    console.log("rendering DocumentsContainer");
    const getDocuments = async () => {
      const d: Document[] = await documentApi.getAll();
      console.log(d);
      setDocuments(d);
    };
    getDocuments();
  }, []);
  return (
    <>
      <DocumentsContainer />
    </>
  );
}
