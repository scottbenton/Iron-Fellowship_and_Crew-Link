import { SECTOR_HEX_TYPES } from "components/features/worlds/SectorSection/hexTypes";
import { Unsubscribe } from "firebase/firestore";
import { Sector } from "types/Sector.type";

export enum SECTOR_TABS {
  NOTES = "notes",
  LOCATIONS = "locations",
}

export interface SectorSliceData {
  openSectorId?: string;
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
  updateHex: (row: number, col: number, type?: SECTOR_HEX_TYPES) => void;
  updateRegion: (region?: string) => Promise<void>;
  deleteSector: () => Promise<void>;
}

export type SectorSlice = SectorSliceData & SectorSliceActions;
