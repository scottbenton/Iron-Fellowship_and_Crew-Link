import { SECTOR_HEX_TYPES } from "components/features/worlds/SectorSection/hexTypes";
import { Unsubscribe } from "firebase/firestore";
import { Sector } from "types/Sector.type";
import { SectorLocationsSlice } from "./sectorLocations/sectorLocations.slice.type";

export enum SECTOR_TABS {
  NOTES = "notes",
  LOCATIONS = "locations",
  NPCS = "npcs",
}

export interface SectorSliceData {
  openSectorId?: string;
  openSectorNotes?: Uint8Array;
  openSectorGMNotes?: Uint8Array;
  openSectorTab: SECTOR_TABS;
  sectorSearch: string;

  sectors: { [sectorId: string]: Sector };
}

export interface SectorSliceActions {
  setOpenSectorId: (sectorId?: string) => void;
  setSectorSearch: (search: string) => void;

  setOpenSectorTab: (tab: SECTOR_TABS) => void;

  subscribe: (worldId: string, worldOwnerIds: string[]) => Unsubscribe;

  createSector: () => Promise<string>;
  updateSector: (sector: Partial<Sector>) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateHex: (
    row: number,
    col: number,
    content:
      | {
          type: SECTOR_HEX_TYPES;
          locationId?: string;
        }
      | undefined
  ) => Promise<void>;
  updateRegion: (region?: string) => Promise<void>;
  deleteSector: () => Promise<void>;

  subscribeToSectorNotes: (
    sectorId: string,
    isPrivate?: boolean
  ) => Unsubscribe;
  updateSectorNotes: (
    sectorId: string,
    notes: Uint8Array,
    isPrivate?: boolean,
    isBeaconRequest?: boolean
  ) => Promise<void>;

  resetStoreNotes: () => void;
  resetStore: () => void;
}

export type SectorSlice = SectorSliceData &
  SectorSliceActions & {
    locations: SectorLocationsSlice;
  };
