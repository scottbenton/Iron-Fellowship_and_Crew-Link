import { Button, DialogContent } from "@mui/material";
import { MarkdownRenderer } from "components/MarkdownRenderer";
import { MoveStatRollers } from "./MoveStatRollers";
import { MoveStats } from "components/MovesSection/MoveStats.type";
import { moveMap } from "data/moves";
import { Stat, PlayerConditionMeter } from "types/stats.enum";
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

  const { rollOracleTable } = useRoller();
  const { customMoveMap } = useCustomMoves();
  const { allCustomOracleMap } = useCustomOracles();
  const allOracles = { ...oracleMap, ...allCustomOracleMap };

  const move = moveMap[id] ?? customMoveMap[id];

  const stats: MoveStats | undefined = useStore((store) => {
    const character = store.characters.currentCharacter.currentCharacter;
    const campaignSupply =
      store.campaigns.currentCampaign.currentCampaign?.supply;
    const assets = Object.values(
      store.characters.currentCharacter.assets.assets
    );

    if (character) {
      return {
        [Stat.Edge]: character.stats[Stat.Edge],
        [Stat.Heart]: character.stats[Stat.Heart],
        [Stat.Iron]: character.stats[Stat.Iron],
        [Stat.Shadow]: character.stats[Stat.Shadow],
        [Stat.Wits]: character.stats[Stat.Wits],
        [PlayerConditionMeter.Health]: character.health,
        [PlayerConditionMeter.Spirit]: character.spirit,
        [PlayerConditionMeter.Supply]: character.campaignId
          ? campaignSupply ?? 0
          : character.supply,
        companionHealth:
          assets
            ?.filter(
              (asset) =>
                asset.trackValue !== null && asset.trackValue !== undefined
            )
            .map((asset) => ({
              companionName:
                asset.customAsset?.Title.Short ??
                assetMap[asset.id]?.Title.Short ??
                "Unknown",
              health: asset.trackValue ?? 0,
            })) ?? [],
      };
    } else {
      return undefined;
    }
  });

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
