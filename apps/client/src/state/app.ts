import { atom } from "jotai";

export const appStateAtom = atom<
  "unauthenticated" | "initializing" | "loading" | "loaded" | "sending" | "waiting" | "error"
>("initializing");
