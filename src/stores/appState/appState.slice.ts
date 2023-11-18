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

  addRoll: (roll) => {
    set((store) => {
      const newRolls = [...store.appState.rolls];
      if (newRolls.length >= 3) {
        newRolls.shift();
      }
      newRolls.push(roll);

      store.appState.rolls = newRolls;
    });
  },
  clearRoll: (index) => {
    set((store) => {
      const newRolls = [...store.appState.rolls];
      newRolls.splice(index, 1);
      store.appState.rolls = newRolls;
    });
  },
  clearRolls: () => {
    set((store) => {
      store.appState.rolls = [];
    });
  },

  announce: (announcement) => {
    set((store) => {
      store.appState.screenReaderAnnouncement = announcement;
    });
  },
});
