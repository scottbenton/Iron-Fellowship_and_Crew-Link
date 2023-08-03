import { AUTH_STATE } from "providers/AuthProvider";
import { AuthSliceData } from "./auth.slice.type";

export const defaultAuthSlice: AuthSliceData = {
  uid: "",
  status: AUTH_STATE.LOADING,
  userNameDialogOpen: false,
};
