import {
  AppBar,
  Box,
  Button,
  Container,
  Hidden,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { AUTH_STATE, useAuth } from "../../providers/AuthProvider";
import {
  BASE_ROUTES,
  basePaths,
  CAMPAIGN_PREFIX,
  CHARACTER_PREFIX,
} from "../../routes";
import { LoginButton } from "./LoginButton";
import { ReactComponent as IronFellowshipLogo } from "./iron-fellowship-logo.svg";
import { useEffect, useState } from "react";
import { HeaderMenu } from "./HeaderMenu";

import CharacterIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Groups";
import WorldIcon from "@mui/icons-material/Public";
import CheckIcon from "@mui/icons-material/Person2"

export function Header() {
  const theme = useTheme();
  const { state } = useAuth();

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
          {state === AUTH_STATE.AUTHENTICATED ? (
            <Box>
              <Hidden smDown>
                <>
                  <Button
                    // 点击的时候切换css样式到dark mode
                    onClick={() => {
                        let container = document.getElementById("container");
                        if(container) {
                          container.style.backgroundColor = "#000000";
                        }
                    }}
                    sx={{
                      color: "white",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    endIcon={<CharacterIcon />}
                  >
                    DarK mode
                  </Button>
                  <Button
                    component={Link}
                    to={basePaths[BASE_ROUTES.CHARACTER]}
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
                    to={basePaths[BASE_ROUTES.CAMPAIGN]}
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
                    to={basePaths[BASE_ROUTES.WORLD]}
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
