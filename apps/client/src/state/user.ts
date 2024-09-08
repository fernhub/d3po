import { atom } from "jotai";
import { UserInfo } from "shared/schema/user";

export const userAtom = atom<UserInfo | null>(null);
