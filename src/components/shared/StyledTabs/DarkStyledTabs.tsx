import { Tabs, TabsProps } from "@mui/material";

export interface DarkStyledTabsProps extends TabsProps {}

export function DarkStyledTabs(props: DarkStyledTabsProps) {
  return (
    <Tabs
      TabIndicatorProps={{
        sx: (theme) => ({
          height: "100%",
          backgroundColor: theme.palette.grey[700],
          color: theme.palette.grey[200],
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
        px: 1,
        backgroundColor: theme.palette.darkGrey.light,
        borderBottom: `1px solid ${theme.palette.darkGrey.dark}`,
        alignItems: "center",
      })}
      variant={"scrollable"}
      {...props}
    />
  );
}
