import { createContext } from "react";

export interface ILinkedDialogContext {
  openDialog: (id: string) => void;
}

export const LinkedDialogContext = createContext<ILinkedDialogContext>({
  openDialog: () => {},
});
