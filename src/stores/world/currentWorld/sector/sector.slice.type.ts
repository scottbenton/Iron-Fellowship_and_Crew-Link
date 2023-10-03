import { SECTOR_HEX_TYPES } from "components/features/worlds/SectorSection/hexTypes";

export interface SectorSliceData {
  sectorMapItems: {
    [row: number]: {
      [col: number]: {
        type: SECTOR_HEX_TYPES | undefined;
      };
    };
  };
}

export interface SectorSliceActions {
  updateHex: (row: number, col: number, type?: SECTOR_HEX_TYPES) => void;
}

export type SectorSlice = SectorSliceData & SectorSliceActions;
