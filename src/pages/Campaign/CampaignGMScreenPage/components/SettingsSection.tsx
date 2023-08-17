import { Stack } from "@mui/material";
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

  return (
    <Stack spacing={3} sx={{ pb: 2 }}>
      <CustomMovesSection
        customMoves={customMoves[uid] ?? []}
        hiddenMoveIds={hiddenMoves}
        showOrHideCustomMove={showOrHideCustomMove}
      />
      <CustomOracleSection
        customOracles={customOracles[uid] ?? []}
        hiddenOracleIds={hiddenOracles}
        showOrHideCustomOracle={showOrHideCustomOracle}
      />
    </Stack>
  );
}
