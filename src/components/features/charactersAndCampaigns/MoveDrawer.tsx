import { SwipeableDrawer } from "@mui/material";
import { MovesSection } from "./MovesSection";
import React, { useCallback } from "react";

export interface MoveDrawerProps {
  open: boolean;
  onClose: () => void;
}

function MoveDrawerUnMemoized(props: MoveDrawerProps) {
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
      <MovesSection />
    </SwipeableDrawer>
  );
}

export const MoveDrawer = React.memo(
  MoveDrawerUnMemoized,
  (prevProps, nextProps) => prevProps.open === nextProps.open
);
