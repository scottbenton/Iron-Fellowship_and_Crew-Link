import { MovesSection } from "./MovesSection";
import React from "react";
import { ReferenceDrawer } from "./ReferenceDrawer";

export interface MoveDrawerProps {
  open: boolean;
  onClose: () => void;
}

function MoveDrawerUnMemoized(props: MoveDrawerProps) {
  const { open, onClose } = props;

  return (
    <ReferenceDrawer title={"Moves"} open={open} onClose={onClose}>
      <MovesSection />
    </ReferenceDrawer>
  );
}

export const MoveDrawer = React.memo(
  MoveDrawerUnMemoized,
  (prevProps, nextProps) => prevProps.open === nextProps.open
);
