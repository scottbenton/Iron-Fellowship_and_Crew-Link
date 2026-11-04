import { AppStateData } from "./appState.slice.type";

export const defaultAppState: AppStateData = {
  openDialogState: {
    isOpen: false,
    previousIds: [],
  },
  rolls: {},
  screenReaderAnnouncementId: 0,
  betaTests: {},
};
