import { Avatar, ButtonBase, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../lib/auth.lib";

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

  const initials = getInitials(user.displayName ?? "");

  return (
    <>
      <ButtonBase
        sx={{ borderRadius: "100%", ml: 2 }}
        ref={anchorRef}
        onClick={() => setMenuOpen(true)}
      >
        <Avatar alt={initials} src={user.photoURL ?? undefined} />
      </ButtonBase>
      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorEl={anchorRef.current}
      >
        <MenuItem
          onClick={() => {
            setMenuOpen(false);
            logout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
