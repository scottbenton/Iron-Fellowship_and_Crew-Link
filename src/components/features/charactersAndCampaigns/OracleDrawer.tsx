import { OracleSection } from "./OracleSection";
import React from "react";
import { ReferenceDrawer } from "./ReferenceDrawer";

export interface OracleDrawerProps {
  open?: boolean;
  onClose: () => void;
}

function OracleDrawerUnMemoized(props: OracleDrawerProps) {
  const { open, onClose } = props;

  return (
    <ReferenceDrawer title={"Oracles"} open={!!open} onClose={onClose}>
      <OracleSection />
    </ReferenceDrawer>
  );
}

export const OracleDrawer = React.memo(
  OracleDrawerUnMemoized,
  (prevProps, nextProps) => prevProps.open === nextProps.open
);
