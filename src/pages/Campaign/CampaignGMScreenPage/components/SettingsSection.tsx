import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import { CustomMovesSection } from "components/features/charactersAndCampaigns/CustomMovesSection";
import { CustomOracleSection } from "components/features/charactersAndCampaigns/CustomOraclesSection";
import { CustomStats } from "components/features/charactersAndCampaigns/CustomStats";
import { CustomTrackSettings } from "components/features/charactersAndCampaigns/CustomTrackSettings";
import { SectionHeading } from "components/shared/SectionHeading";
import { useGameSystem } from "hooks/useGameSystem";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export function SettingsSection() {
  const uid = useStore((store) => store.auth.uid);
  const { gameSystem } = useGameSystem();

  const customMoves = useStore((store) => store.settings.customMoves);
  const customOracles = useStore((store) => store.settings.customOracles);

  const hiddenMoves = useStore((store) => store.settings.hiddenCustomMoveIds);

  const showOrHideCustomMove = useStore(
    (store) => store.settings.toggleCustomMoveVisibility
  );

  const hiddenOracles = useStore(
    (store) => store.settings.hiddenCustomOracleIds
  );
  const showOrHideCustomOracle = useStore(
    (store) => store.settings.toggleCustomOracleVisibility
  );

  const shouldShowDelveMoves = useStore(
    (store) => store.settings.delve.showDelveMoves
  );
  const shouldShowDelveOracles = useStore(
    (store) => store.settings.delve.showDelveOracles
  );
  const updateSettings = useStore((store) => store.settings.updateSettings);

  return (
    <Stack spacing={3} sx={{ pb: 2 }}>
      <SectionHeading label={"Custom Stats"} />

      <CustomStats />
      <CustomTrackSettings />
      <CustomMovesSection
        customMoves={customMoves[uid] ?? []}
        hiddenMoveIds={hiddenMoves}
        showOrHideCustomMove={showOrHideCustomMove}
      />
      {gameSystem === GAME_SYSTEMS.IRONSWORN && (
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldShowDelveMoves}
              onChange={(evt, value) => {
                updateSettings({ hideDelveMoves: !value }).catch(() => {});
              }}
            />
          }
          label={"Show Delve Moves?"}
          sx={{ px: 2 }}
        />
      )}
      <CustomOracleSection
        customOracles={customOracles[uid] ?? []}
        hiddenOracleIds={hiddenOracles}
        showOrHideCustomOracle={showOrHideCustomOracle}
      />
      {gameSystem === GAME_SYSTEMS.IRONSWORN && (
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldShowDelveOracles}
              onChange={(evt, value) => {
                updateSettings({ hideDelveOracles: !value }).catch(() => {});
              }}
            />
          }
          label={"Show Delve Oracles?"}
          sx={{ px: 2 }}
        />
      )}
    </Stack>
  );
}
