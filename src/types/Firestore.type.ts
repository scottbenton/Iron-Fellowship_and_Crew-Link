import { Timestamp } from "firebase/firestore";

export type ConvertToFirestore<T extends object> = {
  [P in keyof T]: T[P] extends Date ? Timestamp : T[P];
};
