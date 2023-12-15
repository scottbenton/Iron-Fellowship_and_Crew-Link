import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { useRef, useState } from "react";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useAppName } from "hooks/useAppName";
import { Link } from "react-router-dom";
import { useIsMobile } from "hooks/useIsMobile";

export function AppsMenu() {
  const { gameSystem } = useGameSystem();
  const appName = useAppName();
  const isDarkMode = useTheme().palette.mode === "dark";

  const listItems: {
    iconLink: string;
    label: string;
    description: string;
    link: string;
    shouldHide?: boolean;
  }[] = [
    {
      iconLink: "/iron-fellowship-logo.svg",
      label: "Iron Fellowship",
      description: `The Ironsworn version of ${appName}`,
      link: "https://iron-fellowship.scottbenton.dev",
      shouldHide: gameSystem === GAME_SYSTEMS.IRONSWORN,
    },
    {
      iconLink: "/crew-link-logo.svg",
      label: "Crew Link",
      description: `The Starforged version of ${appName}`,
      link: "https://starforged-crew-link.scottbenton.dev",
      shouldHide: gameSystem === GAME_SYSTEMS.STARFORGED,
    },
    {
      iconLink: isDarkMode ? "/github-logo-dark.svg" : "/github-logo-light.svg",
      label: `${appName} GitHub`,
      description: "The source code and issue tracker for this site",
      link: "https://github.com/scottbenton/Iron-Fellowship_and_Crew-Link",
    },
    {
      iconLink: "/ironsworn-site-favicon.png",
      label: "Ironsworn Website",
      description: `The official website for Ironsworn games`,
      link: "https://www.ironswornrpg.com/",
    },
    {
      iconLink: "/discord.svg",
      label: `Ironsworn Discord`,
      description: "Visit our channel on the official Discord",
      link: "https://discord.gg/r8fybT2A",
    },
  ];

  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const appsMenuParent = useRef<HTMLButtonElement>(null);

  const isMobile = useIsMobile();

  return (
    <>
      <Tooltip
        title={"Other Apps and Resources"}
        placement={isMobile ? "bottom" : "right"}
      >
        <IconButton
          aria-describedby="apps-menu"
          color={"inherit"}
          ref={appsMenuParent}
          onClick={() => setAppsMenuOpen(true)}
        >
          <AppsIcon aria-label={"Other Apps and Resources"} />
        </IconButton>
      </Tooltip>
      <Menu
        id={"apps-menu"}
        open={appsMenuOpen}
        onClose={() => setAppsMenuOpen(false)}
        anchorEl={appsMenuParent.current}
        anchorOrigin={
          isMobile
            ? { vertical: "bottom", horizontal: "right" }
            : { vertical: "top", horizontal: "left" }
        }
        transformOrigin={
          isMobile
            ? { vertical: "top", horizontal: "right" }
            : { vertical: "bottom", horizontal: "left" }
        }
      >
        {listItems.map((item) =>
          !item.shouldHide ? (
            <MenuItem
              component={Link}
              to={item.link}
              key={item.label}
              sx={{
                whiteSpace: "pre-wrap",
                alignItems: "flex-start!important",
              }}
            >
              <ListItemIcon sx={{ pt: 1 }}>
                <img width={24} height={24} src={item.iconLink} alt={""} />
              </ListItemIcon>
              <ListItemText primary={item.label} secondary={item.description} />
            </MenuItem>
          ) : null
        )}
      </Menu>
    </>
  );
}
