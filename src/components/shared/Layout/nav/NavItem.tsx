import { Box, ButtonBase, SxProps, Typography } from "@mui/material";
import { LinkComponent } from "components/shared/LinkComponent";

export interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  active: boolean;
  onMouseEnter?: () => void;
  sx?: SxProps;
}

export function NavItem(props: NavItemProps) {
  const { label, icon, href, active, sx, onMouseEnter } = props;
  return (
    <ButtonBase
      onMouseEnter={onMouseEnter}
      disableRipple
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          "&:hover>div": {
            bgcolor: active ? "primary.dark" : "darkGrey.light",
          },
          "&:hover>span": {
            color: "common.white",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      LinkComponent={LinkComponent}
      href={href}
    >
      <Box
        sx={(theme) => ({
          borderRadius: 999,
          bgcolor: active ? "primary.main" : "transparent",
          color: active ? "primary.contrastText" : "grey.300",
          width: 56,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: theme.transitions.create(["color", "background-color"], {
            duration: theme.transitions.duration.shorter,
          }),
        })}
      >
        {icon}
      </Box>
      <Typography
        variant={"caption"}
        sx={[
          (theme) =>
            active
              ? { fontWeight: "600", color: theme.palette.common.white }
              : { color: theme.palette.grey[200] },
          (theme) => ({
            transition: theme.transitions.create(["color", "fontWeight"], {
              duration: theme.transitions.duration.shorter,
            }),
          }),
        ]}
      >
        {label}
      </Typography>
    </ButtonBase>
  );
}
