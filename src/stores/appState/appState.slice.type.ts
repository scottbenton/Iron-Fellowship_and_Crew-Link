import { Roll } from "types/DieRolls.type";

export interface AppStateData {
  openDialogState: {
    isOpen: boolean;
    openId?: string;
    previousIds: string[];
  };

  rolls: {
    [rollId: string]: Roll;
  };

  screenReaderAnnouncement?: string;

  betaTests: Record<string, boolean>;
}

export interface AppStateActions {
  openDialog: (id: string) => void;
  prevDialog: () => void;
  closeDialog: () => void;

  addRoll: (rollId: string, roll: Roll) => void;
  clearRoll: (rollId: string) => void;
  clearRolls: () => void;

  announce: (announcement: string) => void;

  updateBetaTests: (newValues: Record<string, boolean>) => void;
}

export type AppStateSlice = AppStateData & AppStateActions;
