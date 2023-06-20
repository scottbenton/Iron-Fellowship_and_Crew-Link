import { TruthOptionClassic } from "dataforged";
import { truthIds } from "data/truths";

export type TRUTH_IDS = (typeof truthIds)[number];

export interface World {
  name: string;
  truths: { [key in TRUTH_IDS]: Truth };
  ownerId: string;
  description?: string;
}

export interface EncodedWorld {
  name: string;
  truths: { [key: string]: Truth };
  ownerId: string;
  description?: string;
}

export interface Truth {
  id: string;
  customTruth?: TruthOptionClassic;
}
