import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import { CustomMovesSection } from "components/CustomMovesSection";
import { CustomOracleSection } from "components/CustomOraclesSection";
import { useStore } from "stores/store";

export function SettingsSection() {
  const uid = useStore((store) => store.auth.uid);

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
      <CustomMovesSection
        customMoves={customMoves[uid] ?? []}
        hiddenMoveIds={hiddenMoves}
        showOrHideCustomMove={showOrHideCustomMove}
      />
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
      <CustomOracleSection
        customOracles={customOracles[uid] ?? []}
        hiddenOracleIds={hiddenOracles}
        showOrHideCustomOracle={showOrHideCustomOracle}
      />
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
    </Stack>
  );
}
