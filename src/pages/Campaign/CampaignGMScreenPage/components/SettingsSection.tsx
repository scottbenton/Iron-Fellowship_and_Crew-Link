import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import { CustomMovesSection } from "components/CustomMovesSection";
import { CustomOracleSection } from "components/CustomOraclesSection";
import { useStore } from "stores/store";

export function SettingsSection() {
  const uid = useStore((store) => store.auth.uid);

  const customMoves = useStore(
    (store) => store.customMovesAndOracles.customMoves
  );
  const customOracles = useStore(
    (store) => store.customMovesAndOracles.customOracles
  );

  const hiddenMoves = useStore(
    (store) => store.customMovesAndOracles.hiddenCustomMoveIds
  );

  const showOrHideCustomMove = useStore(
    (store) => store.customMovesAndOracles.toggleCustomMoveVisibility
  );

  const hiddenOracles = useStore(
    (store) => store.customMovesAndOracles.hiddenCustomOracleIds
  );
  const showOrHideCustomOracle = useStore(
    (store) => store.customMovesAndOracles.toggleCustomOracleVisibility
  );

  const shouldShowDelveMoves = useStore(
    (store) => store.customMovesAndOracles.delve.showDelveMoves
  );
  const shouldShowDelveOracles = useStore(
    (store) => store.customMovesAndOracles.delve.showDelveOracles
  );
  const updateSettings = useStore(
    (store) => store.customMovesAndOracles.updateSettings
  );

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
