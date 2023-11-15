import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import { useEffect, useState } from "react";

import CharacterIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Groups";
import WorldIcon from "@mui/icons-material/Public";
import { Link, useLocation } from "react-router-dom";
import {
  BASE_ROUTES,
  basePaths,
  CAMPAIGN_PREFIX,
  CHARACTER_PREFIX,
  WORLD_PREFIX,
} from "routes";
import { useStore } from "stores/store";
import { AUTH_STATE } from "stores/auth/auth.slice.type";
import { useScrolledToBottom } from "hooks/useScrolledToBottom";
import { useFooterState } from "hooks/useFooterState";

enum ROUTE_TYPES {
  CHARACTER,
  CAMPAIGN,
  WORLD,
}

export function Footer() {
  const { pathname } = useLocation();
  const state = useStore((store) => store.auth.status);

  const [selectedTab, setSelectedTab] = useState<ROUTE_TYPES | undefined>(
    ROUTE_TYPES.CHARACTER
  );

  const { isFooterVisible, footerHeight } = useFooterState();

  useEffect(() => {
    if (pathname.includes(CHARACTER_PREFIX)) {
      setSelectedTab(ROUTE_TYPES.CHARACTER);
    } else if (pathname.includes(CAMPAIGN_PREFIX)) {
      setSelectedTab(ROUTE_TYPES.CAMPAIGN);
    } else if (pathname.includes(WORLD_PREFIX)) {
      setSelectedTab(ROUTE_TYPES.WORLD);
    } else {
      setSelectedTab(undefined);
    }
  }, [pathname]);

  if (state !== AUTH_STATE.AUTHENTICATED) return null;

  return (
    <Box sx={{ display: { xs: "block", sm: "none" } }}>
      <Box height={footerHeight} />
      <Slide in={isFooterVisible} direction="up">
        <BottomNavigation
          sx={(theme) => ({
            bgcolor: theme.palette.darkGrey.main,
            color: theme.palette.darkGrey.contrastText,
            position: "fixed",
            zIndex: theme.zIndex.appBar,
            bottom: 0,
            left: 0,
            right: 0,
            height: footerHeight,
            "&>a": {
              color: theme.palette.darkGrey.contrastText,
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            },
          })}
          showLabels
          value={selectedTab}
          onChange={(evt, newValue) => setSelectedTab(newValue)}
        >
          <BottomNavigationAction
            component={Link}
            to={basePaths[BASE_ROUTES.CHARACTER]}
            label={"Characters"}
            icon={<CharacterIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to={basePaths[BASE_ROUTES.CAMPAIGN]}
            label={"Campaigns"}
            icon={<CampaignIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to={basePaths[BASE_ROUTES.WORLD]}
            label={"Worlds"}
            icon={<WorldIcon />}
          />
        </BottomNavigation>
      </Slide>
    </Box>
  );
}
