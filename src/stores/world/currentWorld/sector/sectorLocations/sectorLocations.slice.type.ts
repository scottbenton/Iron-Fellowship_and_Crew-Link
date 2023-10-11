import { Unsubscribe } from "firebase/firestore";
import { StarforgedLocation } from "types/LocationStarforged.type";

export interface SectorLocationsSliceData {
  locations: { [locationId: string]: StarforgedLocation };
  openLocationNotes?: Uint8Array;
  openLocationGMNotes?: Uint8Array;

  openLocationId?: string;
}

export interface SectorLocationsSliceActions {
  setOpenLocationId: (locationId: string | undefined) => void;

  subscribe: (worldId: string, sectorId: string) => Unsubscribe;
  subscribeToLocationNotes: (
    locationId: string,
    isPrivate?: boolean
  ) => Unsubscribe;

  createLocation: (location: StarforgedLocation) => Promise<string>;
  updateLocation: (
    locationId: string,
    location: Partial<StarforgedLocation>
  ) => Promise<void>;
  deleteLocation: (locationId: string) => Promise<void>;
  updateLocationNotes: (
    locationId: string,
    notes: Uint8Array,
    isPrivate?: boolean,
    isBeaconRequest?: boolean
  ) => Promise<void>;

  resetStoreNotes: () => void;
  resetStore: () => void;
}

export type SectorLocationsSlice = SectorLocationsSliceData &
  SectorLocationsSliceActions;
