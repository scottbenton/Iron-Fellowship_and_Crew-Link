/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ironsworn, Starforged } from "dataforged";
import { ironsworn, starforged } from "dataforged";

export const ironswornMoveCategories = (
  (ironsworn as any).default as Ironsworn
)["Move categories"];
export const starforgedMoveCategories = (
  (starforged as any).default as Starforged
)["Move categories"];

export const ironswornOracleCategories = (
  (ironsworn as any).default as Ironsworn
)["Oracle sets"];
export const starforgedOracleCategories = (
  (starforged as any).default as Starforged
)["Oracle sets"];

export const ironswornAssetCategories = (
  (ironsworn as any).default as Ironsworn
)["Asset types"];
export const starforgedAssetCategories = (
  (starforged as any).default as Starforged
)["Asset types"];

export const ironswornWorldTruths = ((ironsworn as any).default as Ironsworn)[
  "Setting truths"
];
export const starforgedWorldTruths = (
  (starforged as any).default as Starforged
)["Setting truths"];
