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
  // Goes up with every announce() call, so a message that repeats the last one
  // still reaches the live regions and is read out again.
  screenReaderAnnouncementId: number;

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
