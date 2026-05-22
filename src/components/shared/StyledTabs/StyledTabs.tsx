import { Tabs, TabsProps } from "@mui/material";

export interface StyledTabsProps extends TabsProps {
  removeBackgroundColor?: boolean;
}

export function StyledTabs(props: StyledTabsProps) {
  const { sx, removeBackgroundColor, ...otherProps } = props;
  return (
    <Tabs
      TabIndicatorProps={{
        sx: (theme) => ({
          height: "100%",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[300]
              : theme.palette.grey[700],
          color: theme.palette.text.secondary,
          borderRadius: `${theme.shape.borderRadius}px`,
        }),
      }}
      TabScrollButtonProps={{
        sx: {
          alignSelf: "stretch",
        },
      }}
      sx={[
        (theme) => ({
          py: 0,
          px: 1,
          backgroundColor: removeBackgroundColor
            ? undefined
            : theme.palette.background.paperInlay,
          borderBottom: `1px solid ${theme.palette.divider}`,
          alignItems: "center",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      variant={"scrollable"}
      scrollButtons
      allowScrollButtonsMobile
      {...otherProps}
    />
  );
}
