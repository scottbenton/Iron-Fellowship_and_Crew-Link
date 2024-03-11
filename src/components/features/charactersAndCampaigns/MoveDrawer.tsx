import { SwipeableDrawer } from "@mui/material";
import { MovesSection as MovesSectionOld } from "./MovesSection";
import { MovesSection } from "./NewMovesSection";
import React, { useCallback } from "react";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";

export interface MoveDrawerProps {
  open: boolean;
  onClose: () => void;
}

function MoveDrawerUnMemoized(props: MoveDrawerProps) {
  const { open, onClose } = props;

  const useNewMoves = useNewCustomContentPage();

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
      {useNewMoves ? <MovesSection /> : <MovesSectionOld />}
    </SwipeableDrawer>
  );
}

export const MoveDrawer = React.memo(
  MoveDrawerUnMemoized,
  (prevProps, nextProps) => prevProps.open === nextProps.open
);
