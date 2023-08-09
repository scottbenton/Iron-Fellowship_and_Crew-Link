import { Unsubscribe } from "firebase/firestore";
import {
  GMLocationDocument,
  LocationDocument,
  StoredLocation,
} from "types/Locations.type";

export type LocationDocumentWithGMProperties = LocationDocument & {
  gmProperties?: GMLocationDocument | null;
  notes?: Uint8Array | null;
  imageUrl: string;
};

export interface LocationsSliceData {
  locationMap: { [key: string]: LocationDocumentWithGMProperties };
  loading: boolean;
  error?: string;
  openLocationId?: string;
  locationSearch: string;
}

export interface LocationsSliceActions {
  subscribe: (worldId: string, worldOwnerIds: string[]) => Unsubscribe;
  setOpenLocationId: (locationId?: string) => void;
  setLocationSearch: (search: string) => void;

  createLocation: () => Promise<string>;
  deleteLocation: (locationId: string) => Promise<void>;
  updateLocation: (
    locationId: string,
    location: Partial<StoredLocation>
  ) => Promise<void>;
  updateLocationGMNotes: (
    locationId: string,
    notes: string,
    isBeaconRequest?: boolean
  ) => Promise<void>;
  updateLocationGMProperties: (
    locationId: string,
    gmProperties: Partial<GMLocationDocument>
  ) => Promise<void>;
  updateLocationNotes: (
    locationId: string,
    notes: Uint8Array,
    isBeaconRequest?: boolean
  ) => Promise<void>;
  uploadLocationImage: (locationId: string, image: File) => Promise<void>;
  subscribeToOpenLocation: (locationId: string) => Unsubscribe;
}

export type LocationsSlice = LocationsSliceData & LocationsSliceActions;
