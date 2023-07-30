import { Avatar, ButtonBase, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { logout } from "../../lib/auth.lib";
import LogoutIcon from '@mui/icons-material/Logout';

const getInitials = (name: string) => {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export function HeaderMenu() {
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  if (!user) return null;

  const initials = getInitials(user.displayName ?? "User");

  return (
    <>
      <ButtonBase
        sx={{ borderRadius: "100%", ml: 2 }}
        ref={anchorRef}
        onClick={() => setMenuOpen(true)}
      >
        <Avatar src={user.photoURL ?? undefined}>{initials}</Avatar>
      </ButtonBase>
      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorEl={anchorRef.current}
      >
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
      </Menu>
    </>
  );
}
