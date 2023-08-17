import { Move, MoveCategory } from "dataforged";
import { useEffect, useMemo, useState } from "react";
import { License, RollMethod, RollType } from "types/Datasworn";
import { customMoveCategoryPrefix, StoredMove } from "types/Moves.type";
import { useStore } from "stores/store";

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
  const customMoveAuthorMap = useStore(
    (store) => store.customMovesAndOracles.customMoves
  );
  const hiddenMoveIds = useStore(
    (store) => store.customMovesAndOracles.hiddenCustomMoveIds
  );

  const memoizedMoveMap = useMemo(() => {
    return JSON.parse(
      JSON.stringify(customMoveAuthorMap)
    ) as typeof customMoveAuthorMap;
  }, [customMoveAuthorMap]);

  const [customMoveCategories, setCustomMoveCategories] = useState<
    MoveCategory[]
  >([]);

  const [customMoveMap, setCustomMoveMap] = useState<{ [key: string]: Move }>(
    {}
  );

  useEffect(() => {
    const moveCategories: MoveCategory[] = [];
    let newMoveMap: { [key: string]: Move } = {};

    Object.keys(memoizedMoveMap).forEach((moveAuthorId) => {
      const customMoves = memoizedMoveMap[moveAuthorId];
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
  }, [memoizedMoveMap, hiddenMoveIds]);

  return { customMoveCategories, customMoveMap };
}
