import { JsonOracle, Oracle } from "types/Oracles.type";

import jsonMoveOracles from "./move-oracles.json";
import jsonCharacterOracles from "./oracles-character.json";
import jsonMonstrosityOracles from "./oracles-monstrosity.json";
import jsonNameOracles from "./oracles-names.json";
import jsonPlaceOracles from "./oracles-place.json";
import jsonPromptOracles from "./oracles-prompt.json";
import jsonSettlementOracles from "./oracles-settlement.json";
import jsonThreatOracles from "./oracles-threat.json";
import jsonTurningPointOracles from "./oracles-turning-point.json";

export function transformOracles(jsonOracles: JsonOracle): Oracle {
  return {
    name: jsonOracles.Title,
    sections: jsonOracles.Oracles.map((oracle) => ({
      sectionName: oracle.Name,
      table: oracle["Oracle Table"]
        ? oracle["Oracle Table"].map((table) => ({
            chance: table.Chance,
            description: table.Description,
          }))
        : undefined,
      subSection: oracle["Oracles"]
        ? oracle["Oracles"].map((subOracle) => ({
            subSectionName: subOracle.Name,
            table: subOracle["Oracle Table"].map((table) => ({
              chance: table.Chance,
              description: table.Description,
            })),
          }))
        : undefined,
    })),
  };
}

export const moveOracles = transformOracles(jsonMoveOracles);
export const characterOracles = transformOracles(jsonCharacterOracles);
export const monstrosityOracles = transformOracles(jsonMonstrosityOracles);
export const nameOracles = transformOracles(jsonNameOracles);
export const placeOracles = transformOracles(jsonPlaceOracles);
export const promptOracles = transformOracles(jsonPromptOracles);
export const settlementOracles = transformOracles(jsonSettlementOracles);
export const threatOracles = transformOracles(jsonThreatOracles);
export const turningPointOracles = transformOracles(jsonTurningPointOracles);

export const oracles = [
  moveOracles,
  characterOracles,
  monstrosityOracles,
  nameOracles,
  placeOracles,
  promptOracles,
  settlementOracles,
  threatOracles,
  turningPointOracles,
];
