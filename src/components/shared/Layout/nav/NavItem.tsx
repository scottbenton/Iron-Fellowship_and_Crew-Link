import { Box, ButtonBase, SxProps, Typography } from "@mui/material";
import { LinkComponent } from "components/shared/LinkComponent";
import { useRef } from "react";

export interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  active: boolean;
  onMouseEnter?: () => void;
  onHover?: () => void;
  onClick?: () => void;
  sx?: SxProps;
}

export function NavItem(props: NavItemProps) {
  const { label, icon, href, active, sx, onMouseEnter, onHover, onClick } =
    props;

  const isHoveringRef = useRef(false);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    onMouseEnter && onMouseEnter();

    if (onHover) {
      setTimeout(() => {
        if (isHoveringRef.current) {
          onHover();
        }
      }, 500);
    }
  };

  return (
    <ButtonBase
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => (isHoveringRef.current = false)}
      onClick={() => {
        onClick && onClick();
        isHoveringRef.current = false;
      }}
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
