import { AuthSliceData, AUTH_STATE } from "./auth.slice.type";

export const defaultAuthSlice: AuthSliceData = {
  uid: "",
  status: AUTH_STATE.LOADING,
  userNameDialogOpen: false,
};
