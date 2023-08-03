import { Unsubscribe, User } from "firebase/auth";
import { AUTH_STATE } from "providers/AuthProvider";

export interface AuthSliceData {
  user?: User;
  uid: string;
  status: AUTH_STATE;
  userNameDialogOpen: boolean;
}

export interface AuthSliceActions {
  subscribe: () => Unsubscribe;
  closeUserNameDialog: () => void;
}

export type AuthSlice = AuthSliceData & AuthSliceActions;
