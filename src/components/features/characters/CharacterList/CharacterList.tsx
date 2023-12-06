import { Box } from "@mui/material";
import { ReactNode } from "react";
import { CharacterDocument } from "types/Character.type";
import { CharacterListItem } from "./CharacterListItem";
import { constructCharacterSheetPath } from "pages/Character/routes";

export interface CharacterListProps {
  characters: { [key: string]: CharacterDocument };
  actions?: (characterId: string, index: number) => ReactNode;
  maxColumns?: number;
  usePlayerNameAsSecondaryText?: boolean;
  raised?: boolean;
  linkToCharacterSheet?: boolean;
}

export function CharacterList(props: CharacterListProps) {
  const {
    characters,
    actions,
    maxColumns,
    usePlayerNameAsSecondaryText,
    raised,
    linkToCharacterSheet,
  } = props;

  const minGridValue = maxColumns ? 12 / maxColumns : 4;

  return (
    <Box
      component={"ul"}
      display={"grid"}
      gridTemplateColumns={"repeat(12, 1fr)"}
      gap={2}
      pl={0}
      my={0}
      sx={{ listStyle: "none" }}
    >
      {Object.keys(characters).map((characterId, index) => (
        <Box
          component={"li"}
          gridColumn={{
            xs: "span 12",
            sm: `span ${6 > minGridValue ? 6 : minGridValue}`,
            md: `span ${4 > minGridValue ? 4 : minGridValue}`,
          }}
          key={index}
        >
          <CharacterListItem
            characterId={characterId}
            character={characters[characterId]}
            actions={
              actions ? (characterId) => actions(characterId, index) : undefined
            }
            usePlayerNameAsSecondaryText={usePlayerNameAsSecondaryText}
            raised={raised}
            href={
              linkToCharacterSheet
                ? constructCharacterSheetPath(characterId)
                : undefined
            }
          />
        </Box>
      ))}
    </Box>
  );
}
