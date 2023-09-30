import { TruthOptionClassic } from "dataforged";
import { truthIds } from "data/truths";
import { Bytes } from "firebase/firestore";

export type TRUTH_IDS = (typeof truthIds)[number];

export interface World {
  name: string;
  truths?: { [key: string]: Truth };
  ownerIds: string[];
  worldDescription?: Uint8Array;
}

export interface EncodedWorld {
  name: string;
  truths?: { [key: string]: Truth };
  ownerIds: string[];
  worldDescription?: Bytes;
}

export interface Truth {
  id: string;
  customTruth?: TruthOptionClassic;
  selectedSubItemId?: string | null;
}
