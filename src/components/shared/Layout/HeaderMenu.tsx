import {
  ButtonBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRef, useState } from "react";
import { logout } from "lib/auth.lib";
import LogoutIcon from "@mui/icons-material/Logout";
import { useStore } from "stores/store";
import { UserAvatar } from "components/shared/UserAvatar";
import { useToggleTheme } from "providers/ThemeProvider";
import LightThemeIcon from "@mui/icons-material/LightMode";
import DarkThemeIcon from "@mui/icons-material/DarkMode";
import { THEME_TYPE } from "providers/ThemeProvider/themes";
import { useGameSystem } from "hooks/useGameSystem";
import { getIsLocalEnvironment } from "functions/getGameSystem";
import SystemIcon from "@mui/icons-material/Casino";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import {
  CHARACTER_ROUTES,
  constructCharacterPath,
} from "pages/Character/routes";
import AccessibilityIcon from "@mui/icons-material/AccessibilityNew";
import { AccessibilitySettingsDialog } from "../AccessibilitySettingsDialog/AccessibilitySettingsDialog";

export function HeaderMenu() {
  const userId = useStore((store) => store.auth.uid);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const { themeType, toggleTheme } = useToggleTheme();

  const { gameSystem, chooseGameSystem } = useGameSystem();
  const isLocal = getIsLocalEnvironment();

  const [accessibilitySettingsOpen, setAccessibilitySettingsOpen] =
    useState(false);

  return (
    <>
      <ButtonBase
        sx={{ borderRadius: "100%", ml: 2 }}
        className={"dark-focus-outline"}
        aria-label={"User Settings Menu Toggle"}
        focusRipple
        ref={anchorRef}
        onClick={() => setMenuOpen(true)}
      >
        <UserAvatar uid={userId} />
      </ButtonBase>
      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorEl={anchorRef.current}
      >
        <MenuItem
          onClick={() => {
            setMenuOpen(false);
            setAccessibilitySettingsOpen(true);
          }}
        >
          <ListItemIcon>
            <AccessibilityIcon />
          </ListItemIcon>
          <ListItemText>Accessibility Settings</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuOpen(false);
            toggleTheme();
          }}
        >
          <ListItemIcon>
            {themeType === THEME_TYPE.LIGHT ? (
              <DarkThemeIcon />
            ) : (
              <LightThemeIcon />
            )}
          </ListItemIcon>
          <ListItemText>
            {themeType === THEME_TYPE.LIGHT ? "Dark Mode" : "Light Mode"}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuOpen(false);
            logout().then(() => window.location.reload());
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
        {isLocal && (
          <MenuItem
            onClick={() => {
              chooseGameSystem(
                gameSystem === GAME_SYSTEMS.IRONSWORN
                  ? GAME_SYSTEMS.STARFORGED
                  : GAME_SYSTEMS.IRONSWORN
              );
              setMenuOpen(false);
              location.pathname = constructCharacterPath(
                CHARACTER_ROUTES.SELECT
              );
            }}
          >
            <ListItemIcon>
              <SystemIcon />
            </ListItemIcon>
            <ListItemText>Switch System</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <AccessibilitySettingsDialog
        open={accessibilitySettingsOpen}
        onClose={() => setAccessibilitySettingsOpen(false)}
      />
    </>
  );
}
