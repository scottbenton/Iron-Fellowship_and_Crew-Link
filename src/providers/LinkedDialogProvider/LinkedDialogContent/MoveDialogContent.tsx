import { Button, DialogContent, Typography } from "@mui/material";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { MoveStatRollers } from "./MoveStatRollers";
import { moveMap } from "data/moves";
import { LinkedDialogContentTitle } from "./LinkedDialogContentTitle";
import { useCustomMoves } from "components/features/charactersAndCampaigns/MovesSection/useCustomMoves";
import { oracleMap } from "data/oracles";
import { useRoller } from "providers/DieRollProvider";
import { OracleTable } from "dataforged";
import { useCustomOracles } from "components/features/charactersAndCampaigns/OracleSection/useCustomOracles";
import { useStore } from "stores/store";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { getIsLocalEnvironment } from "functions/getGameSystem";

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
  const customMoveStats: { [key: string]: number } = {};
  move.Trigger?.Options?.forEach((option) => {
    option.Using.forEach((roller) => {
      if (roller.includes("/custom_stat")) {
        option["Custom stat"]?.Options.forEach((customStatOption) => {
          customMoveStats[customStatOption.Label] = customStatOption.Value;
          visibleStats[customStatOption.Label] = true;
        });
      } else {
        visibleStats[roller] = true;
      }
    });
  });

  const { gameSystem } = useGameSystem();

  const moveOracles: (OracleTable | undefined)[] =
    move.Oracles?.map(
      // Temporary fix for id mismatch in datasworn
      (oracleId) =>
        allOracles[
          gameSystem === GAME_SYSTEMS.IRONSWORN
            ? oracleId.replace("fifty-fifty", "50_50")
            : oracleId
        ]
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
        {getIsLocalEnvironment() && <Typography>{id}</Typography>}
        <MoveStatRollers
          moveName={move.Title.Short}
          visibleStats={visibleStats}
          customMoveStats={customMoveStats}
        />
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
