import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "stores/store";
import { Virtuoso } from "react-virtuoso";
import { Box, LinearProgress } from "@mui/material";
import { GameLogEntry } from "./GameLogEntry";

const MAX_ITEMS = 1000000000;

export function GameLog() {
  const loading = useStore((store) => store.gameLog.loading);

  const logs = useStore((store) => store.gameLog.logs);

  const orderedLogKeys = useMemo(() => {
    return Object.keys(logs).sort(
      (l1, l2) => logs[l1].timestamp.getTime() - logs[l2].timestamp.getTime()
    );
  }, [logs]);

  const logLength = orderedLogKeys.length;

  const getLogs = useStore((store) => store.gameLog.loadMoreLogs);

  const hasLogs = logLength > 0;
  const loadMoreLogs = useCallback(() => {
    if (hasLogs) {
      getLogs();
    }
  }, [getLogs, hasLogs]);

  const [firstItemIndex, setFirstItemIndex] = useState(MAX_ITEMS);

  useEffect(() => {
    setFirstItemIndex(MAX_ITEMS - logLength);
  }, [logLength]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {loading && <LinearProgress />}
      <Virtuoso
        firstItemIndex={firstItemIndex}
        initialTopMostItemIndex={MAX_ITEMS - 1}
        data={orderedLogKeys}
        startReached={loadMoreLogs}
        itemContent={(index, logId) => (
          <GameLogEntry logId={logId} log={logs[logId]} />
        )}
      />
    </Box>
  );
}
