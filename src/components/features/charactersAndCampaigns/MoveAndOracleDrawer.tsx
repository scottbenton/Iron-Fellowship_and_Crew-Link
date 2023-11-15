import { SwipeableDrawer } from "@mui/material";
import { MovesSection } from "./MovesSection";
import { OracleSection } from "./OracleSection";

export enum MOVE_AND_ORACLE_DRAWER_SECTIONS {
  MOVES,
  ORACLES,
}

export interface MoveAndOracleDrawerProps {
  openSection?: MOVE_AND_ORACLE_DRAWER_SECTIONS;
  closeSection: () => void;
}

export function MoveAndOracleDrawer(props: MoveAndOracleDrawerProps) {
  const { openSection, closeSection } = props;

  return (
    <>
      <SwipeableDrawer
        open={openSection === MOVE_AND_ORACLE_DRAWER_SECTIONS.MOVES}
        onOpen={() => {}}
        disableSwipeToOpen
        disableDiscovery
        onClose={closeSection}
      >
        <MovesSection />
      </SwipeableDrawer>
      <SwipeableDrawer
        open={openSection === MOVE_AND_ORACLE_DRAWER_SECTIONS.ORACLES}
        onOpen={() => {}}
        disableSwipeToOpen
        disableDiscovery
        onClose={closeSection}
      >
        <OracleSection />
      </SwipeableDrawer>
    </>
  );
}
