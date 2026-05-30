import { IconDefinition } from "./Icon.type";

export enum MapEntryType {
  Path = "path",
  Location = "location",
}

export enum MapEntryBackgroundColors {
  Grass = "grass",
  Water = "water",
  Rock = "rock",
  Sand = "sand",
  Dirt = "dirt",
  TreeCover = "treeCover",
  Snow = "snow",
  Mesa = "mesa",
  CherryBlossom = "cherry",
  Magma = "magma",
  Amethyst = "amethyst",
  Basalt = "basalt",
}

export enum MapStrokeColors {
  Light = "light",
  Dark = "dark",
}

export enum MapBackgroundImageFit {
  Contain = "contain",
  Cover = "cover",
}

export interface BaseMapEntry {
  type?: MapEntryType | null;
  background?: {
    color: MapEntryBackgroundColors;
  };
}
export interface MapEntryLocation extends BaseMapEntry {
  type: MapEntryType.Location;
  locationIds: string[];
}

export interface MapEntryPath extends BaseMapEntry {
  type: MapEntryType.Path;
}

export type MapEntry = MapEntryLocation | MapEntryPath;

export interface LocationMap {
  [row: number]: {
    [col: number]: MapEntry | null;
  };
}

export interface Location {
  name: string;

  parentLocationId?: string | null;

  imageFilenames?: string[];
  icon?: IconDefinition;

  sharedWithPlayers?: boolean;
  // Ironsworn only
  characterBonds?: Record<string, boolean>;

  // New Fields - locations 2.0
  type?: string;
  fields?: Record<string, string>;
  map?: LocationMap;
  mapRows?: number;
  mapCols?: number;
  mapHexSize?: number;
  mapBackgroundImageFilename?: string;
  mapBackgroundImageFit?: MapBackgroundImageFit;
  mapStrokeColor?: MapStrokeColors;
  showMap?: boolean;

  updatedDate: Date;
  createdDate: Date;
}

export interface GMLocation {
  fields?: Record<string, string>;
  gmNotes?: Uint8Array;
  // Todo - deprecate
  descriptor?: string;
  trouble?: string;
  locationFeatures?: string;
}
