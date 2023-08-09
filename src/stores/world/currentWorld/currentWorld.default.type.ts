import { CurrentWorldSliceData } from "./currentWorld.slice.type";
import { defaultLocationsSlice } from "./locations/locations.slice.default";

export const defaultCurrentWorldSlice: Omit<
  CurrentWorldSliceData,
  "currentWorldLocations"
> = {
  doAnyDocsHaveImages: false,
};
