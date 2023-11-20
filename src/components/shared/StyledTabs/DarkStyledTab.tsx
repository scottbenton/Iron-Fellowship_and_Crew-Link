import { Tab, TabProps } from "@mui/material";

export function DarkStyledTab(props: TabProps) {
  const { ...tabProps } = props;

  const selected = (tabProps as unknown as { selected: boolean }).selected;
  return (
    <Tab
      sx={(theme) => ({
        zIndex: 1,
        borderRadius: `${theme.shape.borderRadius}px`,
        height: "32px",
        minWidth: 64,
        minHeight: 1,
        textTransform: "unset",

        color:
          (selected ? theme.palette.common.white : theme.palette.grey[200]) +
          "!important",
      })}
      {...tabProps}
    />
  );
}
