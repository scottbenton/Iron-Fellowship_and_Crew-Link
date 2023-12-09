import {
  AppBar,
  ButtonBase,
  Container,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { ReactComponent as IronFellowshipLogo } from "assets/iron-fellowship-logo.svg";
import { ReactComponent as CrewLinkLogo } from "assets/crew-link-logo.svg";

import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useAppName } from "hooks/useAppName";
import { LinkComponent } from "../../LinkComponent";
import { SettingsMenu } from "./SettingsMenu";

export function TopNav() {
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
      sx={{ border: "unset", display: { xs: "block", sm: "none" } }} // Undo border I added to the paper component in dark mode
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
            className={"dark-focus-outline"}
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
          <SettingsMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
