import { Button, DialogContent } from "@mui/material";
import { MarkdownRenderer } from "components/MarkdownRenderer";
import { MoveStatRollers } from "./MoveStatRollers";
import { MoveStats } from "components/MovesSection/MoveStats.type";
import { moveMap } from "data/moves";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { Stat, PlayerConditionMeter } from "types/stats.enum";
import { LinkedDialogContentTitle } from "./LinkedDialogContentTitle";
import { useCustomMoves } from "components/MovesSection/useCustomMoves";
import { oracleMap } from "data/oracles";
import { useRoller } from "providers/DieRollProvider";
import { OracleTable } from "dataforged";
import { useCustomOracles } from "components/OracleSection/useCustomOracles";
import { assetMap } from "data/assets";

export interface MoveDialogContentProps {
  id: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}

export function MoveDialogContent(props: MoveDialogContentProps) {
  const { id, handleBack, handleClose, isLastItem } = props;

  const { rollOracleTable } = useRoller();
  const customMoves = useCustomMoves();
  const customOracles = useCustomOracles()?.Tables;
  const allOracles = { ...oracleMap, ...customOracles };

  const move = moveMap[id] ?? customMoves?.Moves[id];

  const stats: MoveStats | undefined = useCharacterSheetStore((store) =>
    store.character
      ? {
          [Stat.Edge]: store.character.stats[Stat.Edge],
          [Stat.Heart]: store.character.stats[Stat.Heart],
          [Stat.Iron]: store.character.stats[Stat.Iron],
          [Stat.Shadow]: store.character.stats[Stat.Shadow],
          [Stat.Wits]: store.character.stats[Stat.Wits],
          [PlayerConditionMeter.Health]: store.character.health,
          [PlayerConditionMeter.Spirit]: store.character.spirit,
          [PlayerConditionMeter.Supply]: store.supply ?? 0,
          companionHealth:
            store.assets
              ?.filter(
                (asset) =>
                  asset.trackValue !== null && asset.trackValue !== undefined
              )
              .map((asset) => ({
                companionName: assetMap[asset.id].Title.Short,
                health: asset.trackValue ?? 0,
              })) ?? [],
        }
      : undefined
  );

  if (!move) {
    return (
      <>
        <LinkedDialogContentTitle
          handleBack={handleBack}
          handleClose={handleClose}
          isLastItem={isLastItem}
        >
          Move Not Found
        </LinkedDialogContentTitle>
        <DialogContent>Sorry, we could not find that move.</DialogContent>
      </>
    );
  }

  const visibleStats: { [key: string]: boolean } = {};
  move.Trigger?.Options?.forEach((option) => {
    option.Using.forEach((roller) => {
      visibleStats[roller] = true;
    });
  });

  const moveOracles: (OracleTable | undefined)[] =
    move.Oracles?.map(
      // Temporary fix for id mismatch in datasworn
      (oracleId) => allOracles[oracleId.replace("fifty-fifty", "50_50")]
    ) ?? [];

  return (
    <>
      <LinkedDialogContentTitle
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      >
        {move.Title.Standard}
      </LinkedDialogContentTitle>
      <DialogContent>
        <MoveStatRollers stats={stats} visibleStats={visibleStats} />
        <MarkdownRenderer markdown={move.Text} />
        {moveOracles.map(
          (oracle) =>
            oracle && (
              <Button
                key={oracle.$id}
                variant={"outlined"}
                sx={{ mr: 1, mb: 1 }}
                onClick={() => rollOracleTable(oracle.$id)}
              >
                Roll {oracle.Title.Standard.replace("Ask the Oracle: ", "")}
              </Button>
            )
        )}
      </DialogContent>
    </>
  );
}
