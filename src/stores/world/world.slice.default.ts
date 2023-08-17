import { WorldSliceData } from "./world.slice.type";

export const defaultWorldSlice: Omit<WorldSliceData, "currentWorld"> = {
  worldMap: {},
  loading: true,
};
