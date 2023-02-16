import { JsonOracle, Oracle, OracleTable } from "types/Oracles.type";

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
  const sections: { sectionName: string; table: OracleTable }[] = [];

  jsonOracles.Oracles.forEach((section) => {
    if (section["Oracle Table"]) {
      sections.push({
        sectionName: section.Name,
        table: section["Oracle Table"].map((table) => ({
          chance: table.Chance,
          description: table.Description,
        })),
      });
    }
    if (section.Oracles) {
      section.Oracles.forEach((subSection) => {
        sections.push({
          sectionName: section.Name + ": " + subSection.Name,
          table: subSection["Oracle Table"].map((table) => ({
            chance: table.Chance,
            description: table.Description,
          })),
        });
      });
    }
  });

  const oracle: Oracle = {
    name: jsonOracles.Title,
    sections,
  };

  return oracle;
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
