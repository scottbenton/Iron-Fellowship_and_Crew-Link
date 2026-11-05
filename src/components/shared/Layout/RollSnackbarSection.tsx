import { Box, Fab, Slide } from "@mui/material";
import { useFooterState } from "hooks/useFooterState";
import { TransitionGroup } from "react-transition-group";
import ClearIcon from "@mui/icons-material/Close";
import { useStore } from "stores/store";
import { RollDisplay } from "components/features/charactersAndCampaigns/RollDisplay";
import { NormalRollActions } from "components/features/charactersAndCampaigns/RollDisplay/NormalRollActions";
import { useMemo, useRef } from "react";

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

  const sectionRef = useRef<HTMLElement>(null);
  const dismissButtons = useRef<Record<string, HTMLButtonElement | null>>({});

  // A dismissed card takes its focused button with it, which would leave a
  // screen reader nowhere. Focus moves to the next card's Dismiss button, or
  // the previous one's, or back to the page once no card is left.
  const moveFocusFrom = (rollId?: string) => {
    if (!sectionRef.current?.contains(document.activeElement)) {
      return;
    }
    const index = rollId ? sortedRollIds.indexOf(rollId) : -1;
    const nextRollId =
      index >= 0
        ? sortedRollIds[index + 1] ?? sortedRollIds[index - 1]
        : undefined;
    const nextButton = nextRollId
      ? dismissButtons.current[nextRollId]
      : undefined;
    if (nextButton) {
      nextButton.focus();
    } else {
      document.getElementById("main-content")?.focus();
    }
  };

  const hasRolls = sortedRollIds.length > 0;

  return (
    <Box
      component={"section"}
      ref={sectionRef}
      // Named only while it holds rolls, so an empty region is not listed.
      aria-label={hasRolls ? "Recent rolls" : undefined}
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
        "&>ul": {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          listStyle: "none",
          m: 0,
          p: 0,
        },
      })}
    >
      {/* Oldest first, so the newest roll is last, as it is on screen. */}
      <TransitionGroup component={"ul"}>
        {sortedRollIds.map((rollId, index, array) => (
          <Slide direction={"left"} key={rollId}>
            <Box component={"li"} mt={1}>
              <RollDisplay
                roll={rolls[rollId]}
                isExpanded={index === array.length - 1}
                actions={
                  <NormalRollActions rollId={rollId} roll={rolls[rollId]} />
                }
                onDismiss={() => {
                  moveFocusFrom(rollId);
                  clearRoll(rollId);
                }}
                dismissButtonRef={(button) => {
                  dismissButtons.current[rollId] = button;
                }}
              />
            </Box>
          </Slide>
        ))}
      </TransitionGroup>
      <Slide direction={"left"} in={hasRolls} unmountOnExit>
        <Fab
          variant={"extended"}
          size={"medium"}
          color={"primary"}
          onClick={() => {
            moveFocusFrom();
            clearRolls();
          }}
          sx={{ mt: 2 }}
        >
          Clear All
          <ClearIcon sx={{ ml: 1 }} />
        </Fab>
      </Slide>
    </Box>
  );
}
