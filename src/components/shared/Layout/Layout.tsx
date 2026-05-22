import { Box, LinearProgress } from "@mui/material";
import { Outlet } from "react-router-dom";
import { UserNameDialog } from "components/shared/UserNameDialog";
import { useStore } from "stores/store";
import { AUTH_STATE } from "stores/auth/auth.slice.type";
import { SkipToContentButton } from "./SkipToContentButton";
import { useSyncFeatureFlags } from "hooks/featureFlags/useSyncFeatureFlags";
import { LinkedDialog } from "components/features/charactersAndCampaigns/LinkedDialog";
import { LiveRegion } from "../LiveRegion";
import { RollSnackbarSection } from "./RollSnackbarSection";
import { BottomNav } from "./nav/BottomNav";
import { NavRail } from "./nav/NavRail";
import { TopNav } from "./nav/TopNav";
import { LayoutPathListener } from "./LayoutPathListener";
import { UpdateDialog } from "./UpdateDialog";
import { useThemeValue } from "providers/ThemeProvider/useThemeValue";

export function Layout() {
  useSyncFeatureFlags();
  const state = useStore((store) => store.auth.status);

  const userNameDialogOpen = useStore((store) => store.auth.userNameDialogOpen);
  const closeUserNameDialog = useStore(
    (store) => store.auth.closeUserNameDialog
  );

  const background = useThemeValue("background") as
    | {
        type: "background" | "separator";
        node: React.ReactNode;
      }
    | undefined;

  if (state === AUTH_STATE.LOADING) {
    return <LinearProgress color={"primary"} />;
  }

  return (
    <Box
      minHeight={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      sx={(theme) => ({
        backgroundColor:
          background?.type === "background"
            ? undefined
            : theme.palette.background.default,
      })}
    >
      {background?.type === "background" && background?.node ? (
        <>{background.node}</>
      ) : (
        <></>
      )}
      {/* {showStarforgedTheming && <StarforgedStarBackground />} */}
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", sm: "row" }}
        maxHeight={{ xs: undefined, sm: "100vh" }}
        flexGrow={1}
      >
        <LiveRegion />
        <SkipToContentButton />
        <LayoutPathListener />
        <TopNav />
        <NavRail />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflowY: { xs: "unset", sm: "auto" },
          }}
          component={"main"}
          id={"main-content"}
        >
          <Outlet />
        </Box>
      </Box>
      <BottomNav />
      <UserNameDialog
        open={userNameDialogOpen}
        handleClose={closeUserNameDialog}
      />
      <UpdateDialog />
      <LinkedDialog />
      <RollSnackbarSection />
    </Box>
  );
}
