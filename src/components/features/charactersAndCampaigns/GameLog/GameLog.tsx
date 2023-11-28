import { useEffect, useState } from "react";
import { useStore } from "stores/store";
import { Virtuoso } from "react-virtuoso";
import { Box, LinearProgress } from "@mui/material";
import { GameLogEntry } from "./GameLogEntry";

const MAX_ITEMS = 1000000000;

export function GameLog() {
  const loading = useStore((store) => store.gameLog.loading);

  const logs = useStore((store) =>
    Object.values(store.gameLog.logs).sort(
      (l1, l2) => l1.timestamp.getTime() - l2.timestamp.getTime()
    )
  );
  const logLength = logs.length;

  const getLogs = useStore((store) => store.gameLog.loadMoreLogs);
  useEffect(() => {
    if (logLength === 0) {
      getLogs();
    }
  }, [getLogs, logLength]);

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
        data={logs}
        startReached={getLogs}
        itemContent={(index, log) => <GameLogEntry log={log} />}
      />
    </Box>
  );
}
