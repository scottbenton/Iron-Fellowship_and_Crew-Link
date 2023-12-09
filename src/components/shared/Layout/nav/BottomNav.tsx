import { Box, Slide } from "@mui/material";

import CharacterIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Groups";
import WorldIcon from "@mui/icons-material/Public";
import HomebrewIcon from "@mui/icons-material/Brush";
import SignUpIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/AccountCircle";
import { BASE_ROUTES, basePaths } from "routes";
import { useStore } from "stores/store";
import { AUTH_STATE } from "stores/auth/auth.slice.type";
import { useFooterState } from "hooks/useFooterState";
import { NavItem } from "./NavItem";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";
import { NAV_ROUTES, useActiveNavRoute } from "hooks/useActiveNavRoute";

export function BottomNav() {
  const authStatus = useStore((store) => store.auth.status);
  const activeRoute = useActiveNavRoute();

  const newHomebrewViewActive = useNewCustomContentPage();

  const { isFooterVisible, footerHeight } = useFooterState();

  return (
    <Box sx={{ display: { xs: "block", sm: "none", px: 1 } }}>
      <Box height={footerHeight} id={"footer-intersection-observer"} />
      <Slide in={isFooterVisible} direction="up">
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyCOntent: "center",
            bgcolor: theme.palette.darkGrey.main,
            color: theme.palette.darkGrey.contrastText,
            position: "fixed",
            zIndex: theme.zIndex.appBar,
            bottom: 0,
            left: 0,
            right: 0,
            height: footerHeight,
          })}
        >
          {authStatus === AUTH_STATE.AUTHENTICATED ? (
            <>
              <NavItem
                href={basePaths[BASE_ROUTES.CHARACTER]}
                label={"Characters"}
                icon={<CharacterIcon />}
                active={activeRoute === NAV_ROUTES.CHARACTER}
                sx={{ py: 1 }}
              />
              <NavItem
                href={basePaths[BASE_ROUTES.CAMPAIGN]}
                label={"Campaigns"}
                icon={<CampaignIcon />}
                active={activeRoute === NAV_ROUTES.CAMPAIGN}
                sx={{ py: 1 }}
              />
              <NavItem
                href={basePaths[BASE_ROUTES.WORLD]}
                label={"Worlds"}
                icon={<WorldIcon />}
                active={activeRoute === NAV_ROUTES.WORLD}
                sx={{ py: 1 }}
              />
              {newHomebrewViewActive && (
                <NavItem
                  href={basePaths[BASE_ROUTES.HOMEBREW]}
                  label={"Homebrew"}
                  icon={<HomebrewIcon />}
                  active={activeRoute === NAV_ROUTES.HOMEBREW}
                  sx={{ py: 1 }}
                />
              )}{" "}
            </>
          ) : (
            <>
              <NavItem
                href={basePaths[BASE_ROUTES.LOGIN]}
                label={"Log In"}
                icon={<LoginIcon />}
                active={activeRoute === NAV_ROUTES.LOGIN}
                sx={{ py: 1 }}
              />
              <NavItem
                href={basePaths[BASE_ROUTES.SIGNUP]}
                label={"Sign Up"}
                icon={<SignUpIcon />}
                active={activeRoute === NAV_ROUTES.SIGNUP}
                sx={{ py: 1 }}
              />
            </>
          )}
        </Box>
      </Slide>
    </Box>
  );
}
