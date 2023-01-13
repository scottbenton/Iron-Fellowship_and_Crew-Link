import jsonMoves from "./moves.json";
import { Moves, ROLLABLES, ROLLABLE_TRACKS } from "../types/Moves.type";
import { STATS } from "../types/stats.enum";

export const moves: Moves = jsonMoves.Categories.map((jsonCategory) => {
  return {
    categoryName: jsonCategory.Name,
    moves: jsonCategory.Moves.map((jsonMove) => {
      return {
        name: jsonMove.Name,
        text: jsonMove.Text,
        stats: getRollables(jsonMove.Stats),
      };
    }),
  };
});

function getRollables(stats?: string[]): ROLLABLES[] | undefined {
  if (!stats || stats.length === 0) return undefined;

  return stats.map((stat) => {
    switch (stat) {
      case "edge":
        return STATS.EDGE;
      case "heart":
        return STATS.HEART;
      case "iron":
        return STATS.IRON;
      case "shadow":
        return STATS.SHADOW;
      case "wits":
        return STATS.WITS;
      case "health":
        return ROLLABLE_TRACKS.HEALTH;
      case "spirit":
        return ROLLABLE_TRACKS.SPIRIT;
      default:
        return ROLLABLE_TRACKS.SUPPLY;
    }
  });
}
