import { Button, DialogContent } from "@mui/material";
import { MarkdownRenderer } from "components/MarkdownRenderer";
import { MoveStatRollers } from "./MoveStatRollers";
import { moveMap } from "data/moves";
import { LinkedDialogContentTitle } from "./LinkedDialogContentTitle";
import { useCustomMoves } from "components/MovesSection/useCustomMoves";
import { oracleMap } from "data/oracles";
import { useRoller } from "providers/DieRollProvider";
import { OracleTable } from "dataforged";
import { useCustomOracles } from "components/OracleSection/useCustomOracles";
import { assetMap } from "data/assets";
import { useStore } from "stores/store";

export interface MoveDialogContentProps {
  id: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}

export function MoveDialogContent(props: MoveDialogContentProps) {
  const { id, handleBack, handleClose, isLastItem } = props;

  const shouldOracleRollBeGMSOnly = useStore(
    (store) => !store.characters.currentCharacter.currentCharacterId
  );

  const { rollOracleTable } = useRoller();
  const { customMoveMap } = useCustomMoves();
  const { allCustomOracleMap } = useCustomOracles();
  const allOracles = { ...oracleMap, ...allCustomOracleMap };

  const move = moveMap[id] ?? customMoveMap[id];

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
        <MoveStatRollers visibleStats={visibleStats} />
        <MarkdownRenderer markdown={move.Text} />
        {moveOracles.map(
          (oracle) =>
            oracle && (
              <Button
                key={oracle.$id}
                variant={"outlined"}
                sx={{ mr: 1, mb: 1 }}
                onClick={() =>
                  rollOracleTable(oracle.$id, true, shouldOracleRollBeGMSOnly)
                }
              >
                Roll {oracle.Title.Standard.replace("Ask the Oracle: ", "")}
              </Button>
            )
        )}
      </DialogContent>
    </>
  );
}
