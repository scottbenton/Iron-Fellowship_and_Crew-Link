import {
  AppBar,
  Box,
  ButtonBase,
  Container,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppName } from "hooks/useAppName";
import { LinkComponent } from "../../LinkComponent";
import { SettingsMenu } from "./SettingsMenu";
import { AppsMenu } from "./AppsMenu";
import { useThemeValue } from "providers/ThemeProvider/useThemeValue";

export function TopNav() {
  const isLightTheme = useTheme().palette.mode === "light";
  const iconPath = useThemeValue("iconPath") as string;

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
            <img alt={""} width={32} height={32} src={iconPath} />
            <Typography
              fontFamily={(theme) => theme.fontFamilyTitle}
              variant={"h5"}
              component={"p"}
              ml={1}
            >
              {title}
            </Typography>
          </ButtonBase>
          <Box>
            <AppsMenu />
            <SettingsMenu />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
