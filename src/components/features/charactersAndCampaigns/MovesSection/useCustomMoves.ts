import { Move, MoveCategory } from "dataforged";
import { useEffect, useMemo, useState } from "react";
import { License, RollMethod, RollType } from "types/Datasworn";
import { StoredMove } from "types/Moves.type";
import { useStore } from "stores/store";
import { useDataswornId } from "hooks/useDataswornId";

function convertStoredMoveToMove(
  categoryId: string,
  storedMove: StoredMove
): Move {
  return {
    $id: storedMove.$id,
    Title: {
      $id: `${storedMove.$id}/title`,
      Canonical: storedMove.name,
      Standard: storedMove.name,
      Short: storedMove.name,
    },
    Category: categoryId,
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
  const customMoveAuthorMap = useStore((store) => store.settings.customMoves);
  const hiddenMoveIds = useStore((store) => store.settings.hiddenCustomMoveIds);

  const customMoveAuthorNames = useStore((store) => {
    const nameMap: { [key: string]: string } = {};
    Object.keys(customMoveAuthorMap).forEach((authorId) => {
      nameMap[authorId] =
        store.users.userMap[authorId].doc?.displayName ?? "Loading";
    });
    return nameMap;
  });

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

  const { getCustomIdPrefix } = useDataswornId();

  useEffect(() => {
    const moveCategories: MoveCategory[] = [];
    let newMoveMap: { [key: string]: Move } = {};

    const customMoveCategoryPrefix = getCustomIdPrefix("moves");

    Object.keys(memoizedMoveMap).forEach((moveAuthorId) => {
      const customMoves = memoizedMoveMap[moveAuthorId];
      if (
        customMoves &&
        customMoves.length > 0 &&
        Array.isArray(hiddenMoveIds)
      ) {
        const mappedCustomMoves: { [key: string]: Move } = {};

        customMoves.forEach((storedMove) => {
          if (storedMove && !hiddenMoveIds.includes(storedMove.$id)) {
            mappedCustomMoves[storedMove.$id] = convertStoredMoveToMove(
              customMoveCategoryPrefix,
              storedMove
            );
          }
        });

        newMoveMap = { ...newMoveMap, ...mappedCustomMoves };

        const categoryName = `Custom Moves (${customMoveAuthorNames[moveAuthorId]})`;
        moveCategories.push({
          $id: customMoveCategoryPrefix,
          Title: {
            $id: `${customMoveCategoryPrefix}/title`,
            Canonical: categoryName,
            Short: categoryName,
            Standard: categoryName,
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
  }, [memoizedMoveMap, hiddenMoveIds, customMoveAuthorNames]);

  return { customMoveCategories, customMoveMap };
}
