import { Move, MoveCategory } from "dataforged";
import { useCampaignGMScreenStore } from "pages/Campaign/CampaignGMScreenPage/campaignGMScreen.store";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { useEffect, useState } from "react";
import { License, RollMethod, RollType } from "types/Datasworn";
import { customMoveCategoryPrefix, StoredMove } from "types/Moves.type";
import { useUserDocs } from "api/user/getUserDoc";

function convertStoredMoveToMove(storedMove: StoredMove): Move {
  return {
    $id: storedMove.$id,
    Title: {
      $id: `${storedMove.$id}/title`,
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
    Oracles: storedMove.oracleIds,
    Optional: false,
    Trigger: {
      $id: `${storedMove.$id}/outcomes`,
      Options: [
        {
          $id: `${storedMove.$id}/trigger/options/1`,
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
  const hiddenCampaignMoveIds = useCampaignGMScreenStore(
    (store) => store.campaignSettings?.hiddenCustomMoveIds
  );

  const characterSheetCustomMoves = useCharacterSheetStore(
    (store) => store.customMoves
  );
  const hiddenCharacterMoveIds = useCharacterSheetStore(
    (store) => store.characterSettings?.hiddenCustomMoveIds
  );

  const [customMoveCategories, setCustomMoveCategories] = useState<
    MoveCategory[]
  >([]);
  const [customMoveMap, setCustomMoveMap] = useState<{ [key: string]: Move }>(
    {}
  );

  const customMoveOwners = [
    ...Object.keys(campaignCustomMoves),
    ...Object.keys(characterSheetCustomMoves),
  ];
  useUserDocs(customMoveOwners);

  useEffect(() => {
    console.debug("IN USE CUSTOM MOVES HOOK");
    const customStoredMoves = campaignCustomMoves ?? characterSheetCustomMoves;
    const hiddenMoveIds = hiddenCampaignMoveIds ?? hiddenCharacterMoveIds;

    const moveCategories: MoveCategory[] = [];
    let newMoveMap: { [key: string]: Move } = {};

    Object.keys(customStoredMoves).forEach((moveAuthorId) => {
      const customMoves = customStoredMoves[moveAuthorId];
      if (
        customMoves &&
        customMoves.length > 0 &&
        Array.isArray(hiddenMoveIds)
      ) {
        const mappedCustomMoves: { [key: string]: Move } = {};

        customMoves.forEach((storedMove) => {
          if (!hiddenMoveIds.includes(storedMove.$id)) {
            mappedCustomMoves[storedMove.$id] =
              convertStoredMoveToMove(storedMove);
          }
        });

        newMoveMap = { ...newMoveMap, ...mappedCustomMoves };

        moveCategories.push({
          $id: customMoveCategoryPrefix,
          Title: {
            $id: `${customMoveCategoryPrefix}/title`,
            Canonical: "Custom Moves",
            Short: "Custom Moves",
            Standard: "Custom Moves",
          },
          Moves: mappedCustomMoves,
          Source: {
            Title: "Custom Move",
            Authors: [moveAuthorId],
            License: License.None,
          },
          Description: "Moves created by you or your Campaign GM",
          Display: {},
          Optional: true,
        });
      }
    });

    setCustomMoveCategories(moveCategories);
    setCustomMoveMap(newMoveMap);
  }, [
    campaignCustomMoves,
    characterSheetCustomMoves,
    hiddenCampaignMoveIds,
    hiddenCharacterMoveIds,
  ]);

  return { customMoveCategories, customMoveMap };
}
