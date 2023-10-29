import {
  AppBar,
  Box,
  Button,
  ButtonBase,
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
import { PropsWithChildren, forwardRef } from "react";

const LinkComponent = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<{ href: string }>
>((props, ref) => {
  const { href, ...rest } = props;
  return <Link ref={ref} to={href} {...rest} />;
});

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
          <ButtonBase
            focusRipple
            LinkComponent={LinkComponent}
            href={"/"}
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              "&:hover": {
                bgcolor: theme.palette.darkGrey.light,
              },
              py: 0.5,
              px: 1,
              borderRadius: theme.shape.borderRadius + "px",
            })}
          >
            <Logo aria-hidden width={32} height={32} />
            <Typography
              fontFamily={(theme) => theme.fontFamilyTitle}
              variant={"h5"}
              component={"p"}
              ml={2}
            >
              {title}
            </Typography>
          </ButtonBase>
          {state === AUTH_STATE.AUTHENTICATED ? (
            <Box>
              <Hidden smDown>
                <Stack
                  direction={"row"}
                  spacing={1}
                  component={"nav"}
                  sx={{ display: "inline" }}
                >
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
                </Stack>
              </Hidden>
              <HeaderMenu />
            </Box>
          ) : (
            <Stack direction={"row"} spacing={1} component={"nav"}>
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
