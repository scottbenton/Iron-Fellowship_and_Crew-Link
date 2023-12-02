import { Box, Fab, Slide } from "@mui/material";
import { useFooterState } from "hooks/useFooterState";
import { TransitionGroup } from "react-transition-group";
import ClearIcon from "@mui/icons-material/Close";
import { useStore } from "stores/store";
import { RollDisplay } from "components/features/charactersAndCampaigns/RollDisplay";
import { NormalRollActions } from "components/features/charactersAndCampaigns/RollDisplay/NormalRollActions";
import { useMemo } from "react";

export function RollSnackbarSection() {
  const rolls = useStore((store) => store.appState.rolls);
  const clearRoll = useStore((store) => store.appState.clearRoll);
  const clearRolls = useStore((store) => store.appState.clearRolls);

  const sortedRollIds = useMemo(() => {
    return Object.keys(rolls).sort(
      (r1, r2) => rolls[r1].timestamp.getTime() - rolls[r2].timestamp.getTime()
    );
  }, [rolls]);

  const { isFooterVisible, footerHeight } = useFooterState();

  return (
    <Box
      position={"fixed"}
      zIndex={10000}
      bottom={(theme) =>
        `calc(${theme.spacing(2)} + ${isFooterVisible ? footerHeight : 0}px)`
      }
      right={(theme) => theme.spacing(2)}
      ml={2}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"flex-end"}
      sx={(theme) => ({
        transition: theme.transitions.create(["bottom", "transform"]),
        "&>div": {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        },
      })}
    >
      <TransitionGroup>
        {sortedRollIds.map((rollId, index, array) => (
          <Slide direction={"left"} key={rollId}>
            <Box mt={1}>
              <RollDisplay
                roll={rolls[rollId]}
                onClick={() => clearRoll(rollId)}
                isExpanded={index === array.length - 1}
                actions={
                  <NormalRollActions rollId={rollId} roll={rolls[rollId]} />
                }
              />
            </Box>
          </Slide>
        ))}
      </TransitionGroup>
      <Slide direction={"left"} in={sortedRollIds.length > 0} unmountOnExit>
        <Fab
          variant={"extended"}
          size={"medium"}
          color={"primary"}
          onClick={() => clearRolls()}
          sx={{ mt: 2 }}
        >
          Clear All
          <ClearIcon sx={{ ml: 1 }} />
        </Fab>
      </Slide>
    </Box>
  );
}
