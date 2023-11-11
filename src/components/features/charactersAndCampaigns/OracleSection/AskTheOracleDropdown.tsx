import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { useRef, useState } from "react";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRoller } from "providers/DieRollProvider";

export enum ORACLE_KEYS {
  ALMOST_CERTAIN = "almostCertain",
  LIKELY = "likely",
  FIFTY_FIFTY = "fiftyFifty",
  UNLIKELY = "unlikely",
  SMALL_CHANCE = "smallChance",
}

const askTheOracleOracles: GameSystemChooser<{ [key in ORACLE_KEYS]: string }> =
  {
    [GAME_SYSTEMS.IRONSWORN]: {
      [ORACLE_KEYS.ALMOST_CERTAIN]:
        "ironsworn/oracles/moves/ask_the_oracle/almost_certain",
      [ORACLE_KEYS.LIKELY]: "ironsworn/oracles/moves/ask_the_oracle/likely",
      [ORACLE_KEYS.FIFTY_FIFTY]: "ironsworn/oracles/moves/ask_the_oracle/50_50",
      [ORACLE_KEYS.UNLIKELY]: "ironsworn/oracles/moves/ask_the_oracle/unlikely",
      [ORACLE_KEYS.SMALL_CHANCE]:
        "ironsworn/oracles/moves/ask_the_oracle/small_chance",
    },
    [GAME_SYSTEMS.STARFORGED]: {
      [ORACLE_KEYS.ALMOST_CERTAIN]:
        "starforged/oracles/moves/ask_the_oracle/almost_certain",
      [ORACLE_KEYS.LIKELY]: "starforged/oracles/moves/ask_the_oracle/likely",
      [ORACLE_KEYS.FIFTY_FIFTY]:
        "starforged/oracles/moves/ask_the_oracle/fifty-fifty",
      [ORACLE_KEYS.UNLIKELY]:
        "starforged/oracles/moves/ask_the_oracle/unlikely",
      [ORACLE_KEYS.SMALL_CHANCE]:
        "starforged/oracles/moves/ask_the_oracle/small_chance",
    },
  };

const askTheOracleLabels: { [key in ORACLE_KEYS]: string } = {
  [ORACLE_KEYS.ALMOST_CERTAIN]: "Almost Certain",
  [ORACLE_KEYS.LIKELY]: "Likely",
  [ORACLE_KEYS.FIFTY_FIFTY]: "Fifty-Fifty",
  [ORACLE_KEYS.UNLIKELY]: "Unlikely",
  [ORACLE_KEYS.SMALL_CHANCE]: "Small Chance",
};

export function AskTheOracleDropdown() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedOracle, setSelectedOracle] = useState<ORACLE_KEYS>(
    ORACLE_KEYS.FIFTY_FIFTY
  );

  const { rollOracleTable } = useRoller();
  const oracles = useGameSystemValue(askTheOracleOracles);

  const handleClick = () => {
    rollOracleTable(oracles[selectedOracle], true, true);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };
  return (
    <>
      <ButtonGroup
        variant="outlined"
        color={"inherit"}
        ref={anchorRef}
        aria-label="Open the Ask The Oracle Menu"
      >
        <Button
          onClick={handleClick}
          sx={{ width: "17ch", justifyContent: "start" }}
        >
          {askTheOracleLabels[selectedOracle]}
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={() => setOpen(true)}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 10,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {Object.keys(oracles).map((oracleKey, index) => (
                    <MenuItem
                      key={oracleKey}
                      selected={oracleKey === selectedOracle}
                      onClick={(event) => {
                        setSelectedOracle(oracleKey as ORACLE_KEYS);
                        setOpen(false);
                      }}
                    >
                      {askTheOracleLabels[oracleKey as ORACLE_KEYS]}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
