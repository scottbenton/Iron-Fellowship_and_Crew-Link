import {
  BottomNavigation,
  BottomNavigationAction,
  Hidden,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";

import CharacterIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Groups";
import WorldIcon from "@mui/icons-material/Public";
import { Link, useLocation } from "react-router-dom";
import {
  CAMPAIGN_PREFIX,
  CHARACTER_PREFIX,
  paths,
  ROUTES,
  WORLD_PREFIX,
} from "routes";
import { AUTH_STATE, useAuth } from "hooks/useAuth";

enum ROUTE_TYPES {
  CHARACTER,
  CAMPAIGN,
  WORLD,
}

export function Footer() {
  const { pathname } = useLocation();
  const { authState } = useAuth();

  const [selectedTab, setSelectedTab] = useState<ROUTE_TYPES | undefined>(
    ROUTE_TYPES.CHARACTER
  );

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

  if (authState !== AUTH_STATE.AUTHENTICATED) return null;

  return (
    <Hidden smUp>
      <BottomNavigation
        sx={(theme) => ({
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          "&>a": {
            color: theme.palette.primary.contrastText,
            "&.Mui-selected": {
              color: theme.palette.secondary.main,
            },
          },
        })}
        showLabels
        value={selectedTab}
        onChange={(evt, newValue) => setSelectedTab(newValue)}
      >
        <BottomNavigationAction
          component={Link}
          to={paths[ROUTES.CHARACTER_SELECT]}
          label={"Characters"}
          icon={<CharacterIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={paths[ROUTES.CAMPAIGN_SELECT]}
          label={"Campaigns"}
          icon={<CampaignIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to={paths[ROUTES.WORLD_SELECT]}
          label={"Worlds"}
          icon={<WorldIcon />}
        />
      </BottomNavigation>
    </Hidden>
  );
}
