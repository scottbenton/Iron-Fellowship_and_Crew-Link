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
import { Link } from "react-router-dom";
import { BASE_ROUTES, basePaths } from "routes";
import { ReactComponent as IronFellowshipLogo } from "./iron-fellowship-logo.svg";
import { ReactComponent as CrewLinkLogo } from "./crew-link-logo.svg";
import { HeaderMenu } from "./HeaderMenu";

import CharacterIcon from "@mui/icons-material/Person";
import CampaignIcon from "@mui/icons-material/Groups";
import WorldIcon from "@mui/icons-material/Public";
import { useStore } from "stores/store";
import { AUTH_STATE } from "stores/auth/auth.slice.type";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useAppName } from "hooks/useAppName";

export function Header() {
  const state = useStore((store) => store.auth.status);

  const isLightTheme = useTheme().palette.mode === "light";

  const Logo = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: IronFellowshipLogo,
    [GAME_SYSTEMS.STARFORGED]: CrewLinkLogo,
  });

  const title = useAppName();

  return (
    <AppBar
      elevation={0}
      position={"static"}
      color={isLightTheme ? "darkGrey" : "transparent"}
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
            <Logo width={32} height={32} />
            <Typography
              fontFamily={(theme) => theme.fontFamilyTitle}
              variant={"h5"}
              ml={2}
            >
              {title}
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
