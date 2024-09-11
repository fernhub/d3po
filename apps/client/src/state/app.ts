import { atom } from "jotai";

export const appStateAtom = atom<"unathenticated" | "loading" | "sending" | "waiting" | "error">(
  "loading"
);
