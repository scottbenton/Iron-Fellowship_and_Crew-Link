import { Box, ButtonBase, Slide, Stack } from "@mui/material";
import { LinkComponent } from "components/shared/LinkComponent";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { ReactComponent as IronFellowshipLogo } from "assets/iron-fellowship-logo.svg";
import { ReactComponent as CrewLinkLogo } from "assets/crew-link-logo.svg";
import { useAppName } from "hooks/useAppName";
import { NavItem } from "./NavItem";
import { BASE_ROUTES, basePaths } from "routes";

import CharacterIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Groups";
import WorldIcon from "@mui/icons-material/Public";
import HomebrewIcon from "@mui/icons-material/Brush";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";
import { NAV_ROUTES, useActiveNavRoute } from "hooks/useActiveNavRoute";
import { SettingsMenu } from "./SettingsMenu";
import { useStore } from "stores/store";
import { AUTH_STATE } from "stores/auth/auth.slice.type";

import SignUpIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { NavRailFlyouts } from "./NavRailFlyouts";
import { AppsMenu } from "./AppsMenu";

export const NAV_RAIL_WIDTH = 80;

export function NavRail() {
  const Logo = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: IronFellowshipLogo,
    [GAME_SYSTEMS.STARFORGED]: CrewLinkLogo,
  });

  const authStatus = useStore((store) => store.auth.status);

  const title = useAppName();

  const activeRoute = useActiveNavRoute();

  const newHomebrewViewActive = useNewCustomContentPage();

  const [selectedMenu, setSelectedMenu] = useState<NAV_ROUTES>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Box
      onMouseLeave={() => {
        setIsMenuOpen(false);
      }}
      sx={{
        display: { xs: "none", sm: "flex" },
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: NAV_RAIL_WIDTH,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          bgcolor: "darkGrey.main",
          color: "darkGrey.contrastText",
          py: 2,
          px: 1.5,
          zIndex: 11,
        }}
      >
        <Box flexGrow={1}>
          <ButtonBase
            focusRipple
            LinkComponent={LinkComponent}
            href={"/"}
            className={"dark-focus-outline"}
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              "&:hover": {
                bgcolor: theme.palette.darkGrey.light,
              },
              py: 1,
              px: 1,
              borderRadius: theme.shape.borderRadius + "px",
            })}
          >
            <Logo aria-label={title} width={32} height={32} />
          </ButtonBase>
          {/* Fab box */}
          {/* <Box
        sx={{
          width: 56,
          height: 56,
          flexShrink: 0,
          bgcolor: "primary.main",
          mt: 2,
        }}
      ></Box> */}
          <Stack spacing={1.5} component={"nav"} mt={5}>
            {authStatus === AUTH_STATE.AUTHENTICATED ? (
              <>
                <NavItem
                  href={basePaths[BASE_ROUTES.CHARACTER]}
                  label={"Characters"}
                  icon={<CharacterIcon />}
                  active={activeRoute === NAV_ROUTES.CHARACTER}
                  onMouseEnter={() => setSelectedMenu(NAV_ROUTES.CHARACTER)}
                  onHover={() => setIsMenuOpen(true)}
                  onClick={() => setIsMenuOpen(false)}
                />
                <NavItem
                  href={basePaths[BASE_ROUTES.CAMPAIGN]}
                  label={"Campaigns"}
                  icon={<CampaignIcon />}
                  active={activeRoute === NAV_ROUTES.CAMPAIGN}
                  onMouseEnter={() => setSelectedMenu(NAV_ROUTES.CAMPAIGN)}
                  onHover={() => setIsMenuOpen(true)}
                  onClick={() => setIsMenuOpen(false)}
                />
                <NavItem
                  href={basePaths[BASE_ROUTES.WORLD]}
                  label={"Worlds"}
                  icon={<WorldIcon />}
                  active={activeRoute === NAV_ROUTES.WORLD}
                  onMouseEnter={() => setSelectedMenu(NAV_ROUTES.WORLD)}
                  onHover={() => setIsMenuOpen(true)}
                  onClick={() => setIsMenuOpen(false)}
                />
                {newHomebrewViewActive && (
                  <NavItem
                    href={basePaths[BASE_ROUTES.HOMEBREW]}
                    label={"Homebrew"}
                    icon={<HomebrewIcon />}
                    active={activeRoute === NAV_ROUTES.HOMEBREW}
                    onMouseEnter={() => setSelectedMenu(NAV_ROUTES.HOMEBREW)}
                    onHover={() => setIsMenuOpen(true)}
                    onClick={() => setIsMenuOpen(false)}
                  />
                )}
              </>
            ) : (
              <>
                <NavItem
                  href={basePaths[BASE_ROUTES.LOGIN]}
                  label={"Log In"}
                  icon={<LoginIcon />}
                  active={activeRoute === NAV_ROUTES.LOGIN}
                  onMouseEnter={() => setIsMenuOpen(false)}
                />
                <NavItem
                  href={basePaths[BASE_ROUTES.SIGNUP]}
                  label={"Sign Up"}
                  icon={<SignUpIcon />}
                  active={activeRoute === NAV_ROUTES.SIGNUP}
                  onMouseEnter={() => setIsMenuOpen(false)}
                />
              </>
            )}
          </Stack>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <AppsMenu />
          <SettingsMenu />
        </Box>
      </Box>
      <Box
        sx={{
          left: NAV_RAIL_WIDTH,
          position: "fixed",
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <Slide
          in={!!(isMenuOpen && selectedMenu)}
          direction={"right"}
          unmountOnExit
          mountOnEnter
        >
          <Box
            bgcolor={"darkGrey.main"}
            color={"darkGrey.contrastText"}
            sx={(theme) => ({
              borderTopRightRadius: theme.shape.borderRadius,
              borderBottomRightRadius: theme.shape.borderRadius,
              borderColor: "darkGrey.light",
              borderStyle: "solid",
              borderWidth: 1,
              borderLeftWidth: 2,
              py: 4,
              height: "100%",
              maxWidth: "250px",
              minWidth: "250px",
              width: "100%",
            })}
          >
            {selectedMenu && <NavRailFlyouts openMenu={selectedMenu} />}
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}
