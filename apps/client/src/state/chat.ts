import { atom } from "jotai";
import { type ChatMessage } from "shared/schema/chat";

export const chatMessagesAtom = atom<ChatMessage[]>([]);
