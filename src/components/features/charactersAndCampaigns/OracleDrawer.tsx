import { SwipeableDrawer } from "@mui/material";
import { OracleSection } from "./OracleSection";
import React, { useCallback } from "react";

export interface OracleDrawerProps {
  open?: boolean;
  onClose: () => void;
}

function OracleDrawerUnMemoized(props: OracleDrawerProps) {
  const { open, onClose } = props;

  const openCallback = useCallback(() => {}, []);
  return (
    <SwipeableDrawer
      open={open}
      onOpen={openCallback}
      keepMounted
      disableSwipeToOpen
      disableDiscovery
      onClose={onClose}
    >
      <OracleSection />
    </SwipeableDrawer>
  );
}

export const OracleDrawer = React.memo(
  OracleDrawerUnMemoized,
  (prevProps, nextProps) => prevProps.open === nextProps.open
);
