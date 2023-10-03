import { CreateSliceType } from "stores/store.type";
import { SectorSlice } from "./sector.slice.type";
import { defaultSectorSlice } from "./sector.slice.default";

export const createSectorSlice: CreateSliceType<SectorSlice> = (
  set,
  getState
) => ({
  ...defaultSectorSlice,

  updateHex: (row, col, type) => {
    set((store) => {
      if (!store.worlds.currentWorld.currentWorldSectors.sectorMapItems[row]) {
        store.worlds.currentWorld.currentWorldSectors.sectorMapItems[row] = {};
      }
      store.worlds.currentWorld.currentWorldSectors.sectorMapItems[row][col] = {
        type,
      };
    });
  },
});
