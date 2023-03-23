import {
  AppBar,
  Box,
  Button,
  Container,
  Hidden,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { AUTH_STATE, useAuth } from "../../hooks/useAuth";
import { CAMPAIGN_PREFIX, CHARACTER_PREFIX, paths, ROUTES } from "../../routes";
import { LoginButton } from "./LoginButton";
import { ReactComponent as IronFellowshipLogo } from "./iron-fellowship-logo.svg";
import { useEffect, useState } from "react";
import { HeaderMenu } from "./HeaderMenu";

import CharacterIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Groups";
import WorldIcon from "@mui/icons-material/Public";

export function Header() {
  const theme = useTheme();
  const { authState } = useAuth();

  const path = useLocation().pathname;

  const [selectedTab, setSelectedTab] = useState<"character" | "campaign">();

  useEffect(() => {
    if (path.includes(CHARACTER_PREFIX)) {
      setSelectedTab("character");
    } else if (path.includes(CAMPAIGN_PREFIX)) {
      setSelectedTab("campaign");
    } else {
      setSelectedTab(undefined);
    }
  }, [path]);

  return (
    <AppBar elevation={0} position={"static"}>
      <Container maxWidth={"xl"}>
        <Toolbar
          variant={"dense"}
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <IronFellowshipLogo width={32} height={32} />
            <Typography fontFamily={"Staatliches"} variant={"h5"} ml={2}>
              Iron Fellowship
            </Typography>
          </Box>
          {authState === AUTH_STATE.AUTHENTICATED ? (
            <Box>
              <Hidden smDown>
                <>
                  <Button
                    component={Link}
                    to={paths[ROUTES.CHARACTER_SELECT]}
                    sx={{
                      color: "white",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    endIcon={<CharacterIcon />}
                  >
                    Characters
                  </Button>
                  <Button
                    component={Link}
                    to={paths[ROUTES.CAMPAIGN_SELECT]}
                    sx={{
                      color: "white",
                      ml: 1,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    endIcon={<CampaignIcon />}
                  >
                    Campaigns
                  </Button>
                  <Button
                    component={Link}
                    to={paths[ROUTES.WORLD_SELECT]}
                    sx={{
                      color: "white",
                      ml: 1,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    endIcon={<WorldIcon />}
                  >
                    Worlds
                  </Button>
                </>
              </Hidden>
              <HeaderMenu />
            </Box>
          ) : (
            <LoginButton />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
