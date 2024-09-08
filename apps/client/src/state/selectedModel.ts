import { atom } from "jotai";
import { Model } from "shared/schema/model";

export const selectedModelAtom = atom<Model | null>(null);
