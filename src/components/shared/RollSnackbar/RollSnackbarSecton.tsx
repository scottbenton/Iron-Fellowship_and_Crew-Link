import { Box, Fab, Slide } from "@mui/material";
import { useFooterState } from "hooks/useFooterState";
import { TransitionGroup } from "react-transition-group";
import { RollSnackbar } from "./RollSnackbar";
import ClearIcon from "@mui/icons-material/Close";
import { useStore } from "stores/store";

export function RollSnackbarSection() {
  const rolls = useStore((store) => store.appState.rolls);
  const clearRoll = useStore((store) => store.appState.clearRoll);
  const clearRolls = useStore((store) => store.appState.clearRolls);

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
        {rolls.map((roll, index, array) => (
          <Slide
            direction={"left"}
            key={`${roll.rollLabel}.${roll.timestamp.getTime()}.${roll.type}`}
          >
            <span>
              <RollSnackbar
                roll={roll}
                clearRoll={() => clearRoll(index)}
                isExpanded={index === array.length - 1}
              />
            </span>
          </Slide>
        ))}
      </TransitionGroup>
      <Slide direction={"left"} in={rolls.length > 0} unmountOnExit>
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
