export enum CUSTOM_TRACK_SIZE {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export interface TrackValue<T> {
  value: T;
  selectable: boolean;
}

export interface CustomTrack {
  label: string;
  size: CUSTOM_TRACK_SIZE;
  order: number;
  values: TrackValue<number | string>[];
  rollable: boolean;
}
