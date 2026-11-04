import { Box, IconButton, SwipeableDrawer, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PropsWithChildren, useCallback, useId } from "react";
import { LiveRegion } from "components/shared/LiveRegion";

export interface ReferenceDrawerProps extends PropsWithChildren {
  title: string;
  open: boolean;
  onClose: () => void;
}

/**
 * The side drawer phones use for the Moves and Oracles lists.
 *
 * It is a dialog to screen readers, named by its heading, with an explicit
 * Close button: VoiceOver keeps swipes for moving between elements, so a
 * swipe-to-close drawer has no other way out. It also carries its own live
 * region, because MUI hides the rest of the page (and the app's live region)
 * from screen readers while it is open, which silenced every oracle roll.
 */
export function ReferenceDrawer(props: ReferenceDrawerProps) {
  const { title, open, onClose, children } = props;

  const titleId = useId();
  const openCallback = useCallback(() => {}, []);

  return (
    <SwipeableDrawer
      open={open}
      onOpen={openCallback}
      keepMounted
      disableSwipeToOpen
      disableDiscovery
      onClose={onClose}
      PaperProps={{
        role: "dialog",
        "aria-modal": true,
        "aria-labelledby": titleId,
      }}
    >
      <LiveRegion />
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        pl={2}
        pr={1}
        py={0.5}
        color={(theme) => theme.palette.darkGrey.contrastText}
        bgcolor={(theme) => theme.palette.darkGrey.dark}
      >
        <Typography
          id={titleId}
          component={"h2"}
          variant={"h6"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {title}
        </Typography>
        <IconButton
          aria-label={`Close ${title}`}
          onClick={onClose}
          color={"inherit"}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {children}
    </SwipeableDrawer>
  );
}
