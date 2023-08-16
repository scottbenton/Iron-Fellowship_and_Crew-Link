import { Unsubscribe, User } from "firebase/auth";

export enum AUTH_STATE {
  LOADING,
  UNAUTHENTICATED,
  AUTHENTICATED,
}

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
