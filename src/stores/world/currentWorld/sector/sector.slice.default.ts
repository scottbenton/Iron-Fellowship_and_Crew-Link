import { SECTOR_TABS, SectorSliceData } from "./sector.slice.type";

export const defaultSectorSlice: SectorSliceData = {
  sectors: {},
  sectorSearch: "",
  openSectorTab: SECTOR_TABS.LOCATIONS,
};
