import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useRef, useState } from "react";
import { logout } from "lib/auth.lib";
import LogoutIcon from "@mui/icons-material/Logout";
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
import { AccessibilitySettingsDialog } from "./AccessibilitySettingsDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import { BetaTestsDialog } from "./BetaTestsDialog";
import TestsIcon from "@mui/icons-material/AutoAwesome";
import { useNewLayout } from "hooks/featureFlags/useNewLayout";
import { useIsMobile } from "hooks/useIsMobile";

export function SettingsMenu() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const { themeType, toggleTheme } = useToggleTheme();

  const { gameSystem, chooseGameSystem } = useGameSystem();
  const isLocal = getIsLocalEnvironment();

  const [accessibilitySettingsOpen, setAccessibilitySettingsOpen] =
    useState(false);

  const [betaTestsOpen, setBetaTestsOpen] = useState(false);
  const showNewLayout = useNewLayout();
  const isMobile = useIsMobile();

  return (
    <>
      <Tooltip
        title={"User Settings"}
        placement={showNewLayout ? (isMobile ? "bottom" : "right") : undefined}
      >
        <IconButton
          color={"inherit"}
          className={"dark-focus-outline"}
          aria-label={"User Settings Menu Toggle"}
          ref={anchorRef}
          onClick={() => setMenuOpen(true)}
        >
          <SettingsIcon
            sx={(theme) => ({
              transform: `rotate(${menuOpen ? "90deg" : "0deg"})`,
              transition: theme.transitions.create(["transform"], {
                duration: theme.transitions.duration.shorter,
              }),
            })}
          />
        </IconButton>
      </Tooltip>
      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorEl={anchorRef.current}
        anchorOrigin={
          showNewLayout
            ? isMobile
              ? { vertical: "bottom", horizontal: "right" }
              : { vertical: "top", horizontal: "left" }
            : undefined
        }
        transformOrigin={
          showNewLayout
            ? isMobile
              ? { vertical: "top", horizontal: "right" }
              : { vertical: "bottom", horizontal: "left" }
            : undefined
        }
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
            setBetaTestsOpen(true);
          }}
        >
          <ListItemIcon>
            <TestsIcon />
          </ListItemIcon>
          <ListItemText>Beta Tests</ListItemText>
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
      <BetaTestsDialog
        open={betaTestsOpen}
        onClose={() => setBetaTestsOpen(false)}
      />
    </>
  );
}
