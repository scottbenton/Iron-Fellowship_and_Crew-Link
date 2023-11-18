import { Roll } from "types/DieRolls.type";

export interface AppStateData {
  openDialogState: {
    isOpen: boolean;
    openId?: string;
    previousIds: string[];
  };

  rolls: Roll[];

  screenReaderAnnouncement?: string;
}

export interface AppStateActions {
  openDialog: (id: string) => void;
  prevDialog: () => void;
  closeDialog: () => void;

  addRoll: (roll: Roll) => void;
  clearRoll: (index: number) => void;
  clearRolls: () => void;

  announce: (announcement: string) => void;
}

export type AppStateSlice = AppStateData & AppStateActions;
