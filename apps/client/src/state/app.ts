import { atom } from "jotai";

export const appStateAtom = atom<
  "unathenticated" | "initializing" | "loading" | "sending" | "waiting" | "error"
>("initializing");
