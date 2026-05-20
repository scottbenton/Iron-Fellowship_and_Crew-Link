import { IconDefinition } from "./Icon.type";
import { Difficulty } from "./Track.type";

export enum DefaultNPCSpecies {
  Ironlander = "ironlander",
  Elf = "elf",
  Giant = "giant",
  Varou = "varou",
  Troll = "troll",
  Other = "other",
}

export interface NPC {
  name: string;

  imageFilenames?: string[];
  icon?: IconDefinition;

  sharedWithPlayers?: boolean;

  pronouns?: string;
  species?: string | null; // Ironsworn only
  lastLocationId?: string;
  characterConnections?: { [characterId: string]: boolean }; // Starforged only
  characterBonds?: { [characterId: string]: boolean };
  characterBondProgress?: { [characterId: string]: number }; // Starforged only

  rank?: Difficulty; // Starforged only
  callsign?: string; // Starforged only

  updatedDate: Date;
  createdDate: Date;
}

export interface GMNPC {
  goal?: string;
  role?: string;
  descriptor?: string; // Ironsworn only
  disposition?: string;
  activity?: string; // Ironsworn only

  firstLook?: string; // Starforged only
  revealedAspect?: string; // Starforged only
  gmNotes?: Uint8Array;
}
