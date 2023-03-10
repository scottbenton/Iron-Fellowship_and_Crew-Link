import { useContext } from "react";
import { LinkedDialogContext } from "./LinkedDialogContext";

export function useLinkedDialog() {
  return useContext(LinkedDialogContext);
}
