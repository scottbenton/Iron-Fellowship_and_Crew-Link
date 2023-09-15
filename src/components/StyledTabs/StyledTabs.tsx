import { Tabs, TabsProps } from "@mui/material";

export interface StyledTabsProps extends TabsProps {}

export function StyledTabs(props: StyledTabsProps) {
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
      sx={(theme) => ({
        py: 0,
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
        alignItems: "center",
      })}
      variant={"scrollable"}
      scrollButtons
      allowScrollButtonsMobile
      {...props}
    />
  );
}
