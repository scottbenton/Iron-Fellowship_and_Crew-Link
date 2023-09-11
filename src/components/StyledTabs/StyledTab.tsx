import { Tab, TabProps } from "@mui/material";

export function StyledTab(props: TabProps) {
  const { ...tabProps } = props;

  const selected = (tabProps as any).selected;
  return (
    <Tab
      sx={(theme) => ({
        zIndex: 1,
        borderRadius: theme.shape.borderRadius,
        height: "32px",
        minWidth: 64,
        minHeight: 1,
        textTransform: "unset",

        color:
          theme.palette.text[selected ? "primary" : "secondary"] + "!important",
      })}
      {...tabProps}
    />
  );
}
