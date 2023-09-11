import { Grid } from "@mui/material";
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
    <Grid container spacing={2}>
      {Object.keys(characters).map((characterId, index) => (
        <Grid
          item
          xs={12}
          sm={6 > minGridValue ? 6 : minGridValue}
          md={4 > minGridValue ? 6 : minGridValue}
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
        </Grid>
      ))}
    </Grid>
  );
}
