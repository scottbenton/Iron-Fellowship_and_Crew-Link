import { Move, MoveCategory } from "dataforged";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { generateCustomDataswornId } from "functions/dataswornIdEncoder";
import { useEffect, useState } from "react";
import { License, RollMethod, RollType } from "types/Datasworn";
import { customMoveCatgegoryPrefix, StoredMove } from "types/Moves.type";

function convertStoredMoveToMove(storedMove: StoredMove): Move {
  const id = generateCustomDataswornId("ironsworn/moves", storedMove.name);
  return {
    $id: id,
    Title: {
      $id: `${id}/title`,
      Canonical: storedMove.name,
      Standard: storedMove.name,
      Short: storedMove.name,
    },
    Category: "ironsworn/moves/custom",
    Display: {},
    Source: {
      Title: "Custom Move",
      Authors: ["Campaign GM"],
      License: License.None,
    },
    Optional: false,
    Trigger: {
      $id: `${id}/outcomes`,
      Options: [
        {
          $id: `${id}/trigger/options/1`,
          Method: RollMethod.Any,
          "Roll type": RollType.Action,
          Using: storedMove.stats ?? [],
        },
      ],
    },
    Text: storedMove.text,
  };
}

export function useCustomMoves() {
  const campaignCustomMoves = useCampaignGMScreenStore(
    (store) => store.customMoves
  );

  const characterSheetCustomMoves = useCharacterSheetStore(
    (store) => store.customMoves
  );

  const [customMoveCategory, setCustomMoveCategory] = useState<MoveCategory>();

  useEffect(() => {
    const customStoredMoves = campaignCustomMoves || characterSheetCustomMoves;

    if (customStoredMoves && customStoredMoves.length > 0) {
      const mappedCustomMoves: { [key: string]: Move } = {};

      customStoredMoves.forEach((storedMove) => {
        mappedCustomMoves[storedMove.$id] = convertStoredMoveToMove(storedMove);
      });

      setCustomMoveCategory({
        $id: customMoveCatgegoryPrefix,
        Title: {
          $id: `${customMoveCatgegoryPrefix}/title`,
          Canonical: "Custom Moves",
          Short: "Custom Moves",
          Standard: "Custom Moves",
        },
        Moves: mappedCustomMoves,
        Source: {
          Title: "Custom Move",
          Authors: [],
          License: License.None,
        },
        Description: "Moves created by you or your Campaign GM",
        Display: {},
        Optional: true,
      });
    } else {
      setCustomMoveCategory(undefined);
    }
  }, [campaignCustomMoves, characterSheetCustomMoves]);

  return customMoveCategory;
}
