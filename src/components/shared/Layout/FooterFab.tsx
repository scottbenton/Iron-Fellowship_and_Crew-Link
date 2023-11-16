import { Fab, FabProps } from "@mui/material";
import { useFooterState } from "hooks/useFooterState";

export function FooterFab(props: FabProps) {
  const { isFooterVisible, footerHeight } = useFooterState();

  return (
    <Fab
      {...props}
      sx={(theme) => ({
        position: "fixed",
        bottom: `calc(${theme.spacing(2)} + ${
          isFooterVisible ? footerHeight : 0
        }px)`,
        transition: theme.transitions.create(["bottom", "transform"]),
        right: theme.spacing(2),
      })}
    />
  );
}
