import {
  AppBar,
  Box,
  Button,
  Container,
  Hidden,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  BASE_ROUTES,
  basePaths,
  CAMPAIGN_PREFIX,
  CHARACTER_PREFIX,
} from "../../routes";
import { ReactComponent as IronFellowshipLogo } from "./iron-fellowship-logo.svg";
import { useEffect, useState } from "react";
import { HeaderMenu } from "./HeaderMenu";

import CharacterIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Groups";
import WorldIcon from "@mui/icons-material/Public";
import { useStore } from "stores/store";
import { AUTH_STATE } from "stores/auth/auth.slice.type";

export function Header() {
  const theme = useTheme();
  const state = useStore((store) => store.auth.status);

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
    <AppBar
      elevation={0}
      position={"static"}
      color={"darkGrey"}
      enableColorOnDark
      component={"div"}
      sx={{ border: "unset" }} // Undo border I added to the paper component in dark mode
    >
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
                    color={"inherit"}
                    component={Link}
                    to={basePaths[BASE_ROUTES.CHARACTER]}
                    endIcon={<CharacterIcon />}
                    sx={{
                      "&:hover": {
                        backgroundColor: "darkGrey.light",
                      },
                    }}
                  >
                    Characters
                  </Button>
                  <Button
                    color={"inherit"}
                    component={Link}
                    to={basePaths[BASE_ROUTES.CAMPAIGN]}
                    endIcon={<CampaignIcon />}
                    sx={{
                      "&:hover": {
                        backgroundColor: "darkGrey.light",
                      },
                    }}
                  >
                    Campaigns
                  </Button>
                  <Button
                    color={"inherit"}
                    component={Link}
                    to={basePaths[BASE_ROUTES.WORLD]}
                    endIcon={<WorldIcon />}
                    sx={{
                      "&:hover": {
                        backgroundColor: "darkGrey.light",
                      },
                    }}
                  >
                    Worlds
                  </Button>
                </>
              </Hidden>
              <HeaderMenu />
            </Box>
          ) : (
            <Stack direction={"row"} spacing={1}>
              <Button
                color={"inherit"}
                component={Link}
                to={basePaths[BASE_ROUTES.LOGIN]}
              >
                Login
              </Button>
              <Button
                variant={"contained"}
                color={"primary"}
                component={Link}
                to={basePaths[BASE_ROUTES.SIGNUP]}
              >
                Create Account
              </Button>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
