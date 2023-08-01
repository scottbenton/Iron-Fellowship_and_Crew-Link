import produce from "immer";
import { StoredMove } from "types/Moves.type";
import { StoreApi } from "zustand";

export interface CustomMovesStoreProperties {
  customMoves: {
    [uid: string]: StoredMove[];
  };
  setCustomMoves: (uid: string, moves: StoredMove[]) => void;
}

export const initialCustomMovesState = {
  customMoves: {},
};

export const customMovesStore = (
  set: StoreApi<CustomMovesStoreProperties>["setState"]
) => ({
  setCustomMoves: (uid: string, moves: StoredMove[]) => {
    set(
      produce((state: CustomMovesStoreProperties) => {
        state.customMoves[uid] = moves;
      })
    );
  },
});
