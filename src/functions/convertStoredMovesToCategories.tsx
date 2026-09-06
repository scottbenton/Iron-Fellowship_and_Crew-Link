import { Datasworn } from "@datasworn-community/core";
import { License } from "types/Datasworn";
import {
  MoveType,
  HomebrewMoveDocument,
} from "api-calls/homebrew/moves/moves/_homebrewMove.type";
import { HomebrewMoveCategoryDocument } from "api-calls/homebrew/moves/categories/_homebrewMoveCategory.type";

const DEFAULT_SOURCE: Datasworn.SourceInfo = {
  title: "Homebrew Content",
  authors: [],
  date: "2000-01-01",
  url: "",
  license: License.None,
};

// ─── ID builders ─────────────────────────────────────────────────────────────

export function buildMoveCategoryId(
  homebrewId: string,
  categoryId: string,
): string {
  return `move_category:${homebrewId}/${categoryId}`;
}

export function buildMoveId(
  homebrewId: string,
  categoryId: string,
  moveId: string,
): string {
  return `move:${homebrewId}/${categoryId}/${moveId}`;
}

export function buildMoveConditionId(
  homebrewId: string,
  categoryId: string,
  moveId: string,
  index: number,
): string {
  return `move.condition:${homebrewId}/${categoryId}/${moveId}.${index}`;
}

export function buildMoveOutcomeId(
  homebrewId: string,
  categoryId: string,
  moveId: string,
  outcome: "strong_hit" | "weak_hit" | "miss",
): string {
  return `move.outcome:${homebrewId}/${categoryId}/${moveId}.${outcome}`;
}

// ─── Conversion ───────────────────────────────────────────────────────────────

export function convertStoredMovesToCategories(
  homebrewId: string,
  storedCategories: Record<string, HomebrewMoveCategoryDocument>,
  storedMoves: Record<string, HomebrewMoveDocument>,
): Record<string, Datasworn.MoveCategory> {
  const categories: Record<string, Datasworn.MoveCategory> = {};

  Object.keys(storedCategories)
    .sort((c1, c2) =>
      storedCategories[c1].label.localeCompare(storedCategories[c2].label),
    )
    .forEach((categoryId) => {
      const storedCategory = storedCategories[categoryId];
      categories[categoryId] = {
        _id: buildMoveCategoryId(homebrewId, categoryId),
        type: "move_category",
        name: storedCategory.label,
        _source: DEFAULT_SOURCE,
        description: storedCategory.description,
        enhances: storedCategory.enhancesId
          ? [storedCategory.enhancesId]
          : undefined,
        replaces: storedCategory.replacesId
          ? [storedCategory.replacesId]
          : undefined,
        contents: {},
        collections: {},
      };
    });

  Object.keys(storedMoves)
    .sort((m1, m2) =>
      storedMoves[m1].label.localeCompare(storedMoves[m2].label),
    )
    .forEach((moveId) => {
      const move = storedMoves[moveId];
      const convertedMove = convertStoredMove(homebrewId, moveId, move);
      const moveCategory = categories[move.categoryId];

      if (!moveCategory.contents) {
        moveCategory.contents = { [moveId]: convertedMove };
      } else {
        moveCategory.contents[moveId] = convertedMove;
      }
    });

  return categories;
}

function convertStoredMove(
  homebrewId: string,
  moveId: string,
  move: HomebrewMoveDocument,
): Datasworn.Move {
  const catId = move.categoryId;
  const moveFullId = buildMoveId(homebrewId, catId, moveId);

  if (move.type === MoveType.NoRoll) {
    const m: Datasworn.MoveNoRoll = {
      _id: moveFullId,
      type: "move",
      name: move.label,
      text: move.text,
      replaces: move.replacesId ? [move.replacesId] : undefined,
      roll_type: "no_roll",
      _source: DEFAULT_SOURCE,
      trigger: {
        text: "",
        conditions: [],
      },
      outcomes: null,
      allow_momentum_burn: false,
      // oracles: move.oracles, // TODO - add oracles again here
    };
    return m;
  } else if (move.type === MoveType.ActionRoll) {
    const m: Datasworn.MoveActionRoll = {
      _id: moveFullId,
      type: "move",
      name: move.label,
      text: move.text,
      replaces: move.replacesId ? [move.replacesId] : undefined,
      roll_type: "action_roll",
      _source: DEFAULT_SOURCE,
      trigger: {
        text: "",
        conditions: [
          {
            _id: buildMoveConditionId(homebrewId, catId, moveId, 0),
            method: "player_choice",
            roll_options: (move.stats ?? []).map((stat) => ({
              using: "stat",
              stat,
            })),
          },
          {
            _id: buildMoveConditionId(homebrewId, catId, moveId, 1),
            method: "player_choice",
            roll_options: (move.conditionMeters ?? []).map(
              (conditionMeter) => ({
                using: "condition_meter",
                condition_meter: conditionMeter,
              }),
            ),
          },
          {
            _id: buildMoveConditionId(homebrewId, catId, moveId, 2),
            method: "player_choice",
            roll_options: (move.assetControls ?? []).map((control) => ({
              using: "asset_control",
              control,
              assets: ["*"],
            })),
          },
        ],
      },
      // oracles: move.oracles,
      outcomes: {
        strong_hit: {
          _id: buildMoveOutcomeId(homebrewId, catId, moveId, "strong_hit"),
          text: "",
        },
        weak_hit: {
          _id: buildMoveOutcomeId(homebrewId, catId, moveId, "weak_hit"),
          text: "",
        },
        miss: {
          _id: buildMoveOutcomeId(homebrewId, catId, moveId, "miss"),
          text: "",
        },
      },
      allow_momentum_burn: true,
    };
    return m;
  } else if (move.type === MoveType.ProgressRoll) {
    const m: Datasworn.MoveProgressRoll = {
      _id: moveFullId,
      type: "move",
      name: move.label,
      text: move.text,
      replaces: move.replacesId ? [move.replacesId] : undefined,
      roll_type: "progress_roll",
      _source: DEFAULT_SOURCE,
      trigger: {
        text: "",
        conditions: [
          {
            _id: buildMoveConditionId(homebrewId, catId, moveId, 0),
            method: "progress_roll",
            roll_options: [
              {
                using: "progress_track",
              },
            ],
          },
        ],
      },
      tracks: {
        category: move.category,
      },
      // oracles: move.oracles,
      outcomes: {
        strong_hit: {
          _id: buildMoveOutcomeId(homebrewId, catId, moveId, "strong_hit"),
          text: "",
        },
        weak_hit: {
          _id: buildMoveOutcomeId(homebrewId, catId, moveId, "weak_hit"),
          text: "",
        },
        miss: {
          _id: buildMoveOutcomeId(homebrewId, catId, moveId, "miss"),
          text: "",
        },
      },
      allow_momentum_burn: false,
    };
    return m;
  } else {
    const m: Datasworn.MoveSpecialTrack = {
      _id: moveFullId,
      type: "move",
      name: move.label,
      text: move.text,
      replaces: move.replacesId ? [move.replacesId] : undefined,
      roll_type: "special_track",
      _source: DEFAULT_SOURCE,
      trigger: {
        text: "",
        conditions: [
          {
            _id: buildMoveConditionId(homebrewId, catId, moveId, 0),
            method: "all",
            roll_options: move.specialTracks.map((specialTrack) => ({
              using: specialTrack,
            })),
          },
        ],
      },
      // oracles: move.oracles,
      outcomes: {
        strong_hit: {
          _id: buildMoveOutcomeId(homebrewId, catId, moveId, "strong_hit"),
          text: "",
        },
        weak_hit: {
          _id: buildMoveOutcomeId(homebrewId, catId, moveId, "weak_hit"),
          text: "",
        },
        miss: {
          _id: buildMoveOutcomeId(homebrewId, catId, moveId, "miss"),
          text: "",
        },
      },
      allow_momentum_burn: false,
    };
    return m;
  }
}
