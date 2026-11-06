import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "stores/store";
import { ItemProps, ListProps, Virtuoso } from "react-virtuoso";
import { Box, LinearProgress } from "@mui/material";
import { GameLogEntry } from "./GameLogEntry";
import { CustomDiceRollerButton } from "components/features/charactersAndCampaigns/CustomDiceRollerButton";

const MAX_ITEMS = 1000000000;

// Virtuoso renders plain divs. These make the log a list, so screen readers
// say it is one and can move from entry to entry.
const LogList = forwardRef<HTMLDivElement, ListProps>(
  function LogList(props, ref) {
    const { children, style } = props;
    return (
      <Box
        component={"ul"}
        ref={ref}
        style={style}
        aria-label={"Roll log, oldest first"}
        sx={{ listStyle: "none", m: 0, p: 0 }}
      >
        {children}
      </Box>
    );
  }
);

function LogItem(props: ItemProps<string>) {
  // Virtuoso also passes the item, which is not an attribute of the element.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item, ...rest } = props;
  return <li {...rest} />;
}

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
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {loading && <LinearProgress aria-label={"Loading rolls"} />}
      <Box sx={{ flexGrow: 1 }}>
        <Virtuoso
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={MAX_ITEMS - 1}
          data={orderedLogKeys}
          startReached={loadMoreLogs}
          components={{ List: LogList, Item: LogItem }}
          itemContent={(index, logId) => (
            <GameLogEntry logId={logId} log={logs[logId]} />
          )}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          px: 1,
          py: 1,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <CustomDiceRollerButton />
      </Box>
    </Box>
  );
}
