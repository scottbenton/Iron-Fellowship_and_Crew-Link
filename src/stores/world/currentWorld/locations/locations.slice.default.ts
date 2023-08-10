import { LocationsSliceData } from "./locations.slice.type";

export const defaultLocationsSlice: LocationsSliceData = {
  locationMap: {},
  loading: false,
  locationSearch: "",
  error: undefined,
  openLocationId: undefined,
};
