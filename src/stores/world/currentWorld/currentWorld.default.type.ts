import { CurrentWorldSliceData } from "./currentWorld.slice.type";

export const defaultCurrentWorldSlice: Omit<
  CurrentWorldSliceData,
  "currentWorldLocations" | "currentWorldNPCs" | "currentWorldLore"
> = {
  doAnyDocsHaveImages: false,
};
