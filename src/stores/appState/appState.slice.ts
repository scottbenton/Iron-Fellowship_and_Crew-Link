import { CreateSliceType } from "stores/store.type";
import { AppStateSlice } from "./appState.slice.type";
import { defaultAppState } from "./appState.slice.default";

export const createAppStateSlice: CreateSliceType<AppStateSlice> = (set) => ({
  ...defaultAppState,

  openDialog: (id) => {
    set((store) => {
      const currentState = store.appState.openDialogState;

      if (currentState.openId && currentState.isOpen) {
        store.appState.openDialogState = {
          isOpen: true,
          previousIds: [...currentState.previousIds, currentState.openId],
          openId: id,
        };
      } else {
        store.appState.openDialogState = {
          isOpen: true,
          previousIds: [],
          openId: id,
        };
      }
    });
  },
  prevDialog: () => {
    set((store) => {
      const previousOpenDialogIds = store.appState.openDialogState.previousIds;
      if (previousOpenDialogIds.length > 0) {
        const newIds = [...previousOpenDialogIds];
        const nextId = newIds.pop();

        store.appState.openDialogState = {
          isOpen: true,
          openId: nextId,
          previousIds: newIds,
        };
      }
    });
  },
  closeDialog: () => {
    set((store) => {
      store.appState.openDialogState.isOpen = false;
      store.appState.openDialogState.previousIds = [];
    });
  },

  addRoll: (rollId, roll) => {
    set((store) => {
      const rolls = store.appState.rolls;
      const newRollIds = Object.keys(rolls).sort(
        (r1, r2) =>
          rolls[r1].timestamp.getTime() - rolls[r2].timestamp.getTime()
      );
      if (newRollIds.length >= 3) {
        delete rolls[newRollIds[0]];
      }
      rolls[rollId] = roll;
    });
  },
  clearRoll: (rollId) => {
    set((store) => {
      delete store.appState.rolls[rollId];
    });
  },
  clearRolls: () => {
    set((store) => {
      store.appState.rolls = {};
    });
  },

  announce: (announcement) => {
    set((store) => {
      store.appState.screenReaderAnnouncement = announcement;
    });
  },

  updateBetaTests: (newTests) => {
    set((store) => {
      store.appState.betaTests = newTests;
    });
  },
});
