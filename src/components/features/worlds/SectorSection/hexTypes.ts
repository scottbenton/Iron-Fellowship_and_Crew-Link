import { CreatureIcon } from "./assets/CreatureIcon";
import { PlanetIcon } from "./assets/PlanetIcon";
import { StarIcon } from "./assets/StarIcon";
import { VaultIcon } from "./assets/VaultIcon";
import { DerelictIcon } from "./assets/DerelictIcon";
import { ShipIcon } from "./assets/ShipIcon";
import { SightingIcon } from "./assets/SightingIcon";
import { SettlementIcon } from "./assets/SettlementIcon";
import PathIcon from "@mui/icons-material/Timeline";

export enum SECTOR_HEX_TYPES {
  PLANET = "planet",
  STAR = "star",
  VAULT = "vault",
  SETTLEMENT = "settlement",
  DERELICT = "derelict",
  SHIP = "ship",
  CREATURE = "creature",
  OTHER = "other",
  PATH = "path",
}

export const hexTypeMap: {
  [key in SECTOR_HEX_TYPES]: {
    Icon: typeof CreatureIcon | typeof PathIcon;
    color?: string;
    name: string;
  };
} = {
  [SECTOR_HEX_TYPES.PATH]: {
    Icon: PathIcon,
    color: "#cbd5e1",
    name: "Path",
  },
  [SECTOR_HEX_TYPES.PLANET]: {
    Icon: PlanetIcon,
    color: "#2dd4bf",
    name: "Planet",
  },
  [SECTOR_HEX_TYPES.SETTLEMENT]: {
    Icon: SettlementIcon,
    color: "#e2e8f0",
    name: "Settlement",
  },
  [SECTOR_HEX_TYPES.STAR]: { Icon: StarIcon, color: "#eab308", name: "Star" },
  [SECTOR_HEX_TYPES.CREATURE]: { Icon: CreatureIcon, name: "Creature" },
  [SECTOR_HEX_TYPES.DERELICT]: {
    Icon: DerelictIcon,
    color: "#f59e0b",
    name: "Derelict",
  },
  [SECTOR_HEX_TYPES.SHIP]: { Icon: ShipIcon, color: "#f87171", name: "Ship" },
  [SECTOR_HEX_TYPES.VAULT]: {
    Icon: VaultIcon,
    color: "#38bdf8",
    name: "Vault",
  },
  [SECTOR_HEX_TYPES.OTHER]: {
    Icon: SightingIcon,
    color: "#4ade80",
    name: "Other",
  },
};
