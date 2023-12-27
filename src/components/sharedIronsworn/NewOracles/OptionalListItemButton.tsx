import {
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemProps,
} from "@mui/material";

export interface OptionalListItemButtonProps extends ListItemProps {
  showButton: boolean;
  onClick?: () => void;
  listItemButtonProps?: ListItemButtonProps;
}

export function OptionalListItemButton(props: OptionalListItemButtonProps) {
  const {
    showButton,
    onClick,
    listItemButtonProps,
    children,
    ...listItemProps
  } = props;

  if (showButton) {
    return (
      <ListItem disablePadding {...listItemProps}>
        <ListItemButton onClick={onClick} {...listItemButtonProps}>
          {children}
        </ListItemButton>
      </ListItem>
    );
  }
  return <ListItem {...listItemProps}>{children}</ListItem>;
}
