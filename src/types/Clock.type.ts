import { Timestamp } from "firebase/firestore";
import { TRACK_STATUS } from "./Track.type";

export interface Clock {
  label: string;
  description?: string;
  segments: number;
  value: number;
  status: TRACK_STATUS;
  createdDate: Date;
}

export interface ClockDocument extends Omit<Clock, "createdDate"> {
  createdTimestamp: Timestamp;
}
