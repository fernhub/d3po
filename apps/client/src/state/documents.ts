import { atom } from "jotai";
import { type Document } from "shared/schema/document";

export const documentsAtom = atom<Document[]>([]);

export const selectedDocumentAtom = atom<Document | null>(null);
