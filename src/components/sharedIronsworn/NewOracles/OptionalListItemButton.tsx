import {
  Box,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemProps,
} from "@mui/material";
import { useEffect, useState } from "react";

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
    sx,
    secondaryAction,
    ...listItemProps
  } = props;

  const [actionContainer, setActionContainer] = useState<HTMLDivElement>();
  const [actionWidth, setActionWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((elements) => {
      elements.forEach((element) => {
        console.debug(element);
        setActionWidth(element.contentRect.width);
      });
    });
    if (!secondaryAction) {
      setActionContainer(undefined);
      setActionWidth(0);
    } else {
      if (actionContainer) {
        resizeObserver.observe(actionContainer);
      }
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [actionContainer, secondaryAction]);

  if (showButton) {
    return (
      <ListItem
        secondaryAction={
          secondaryAction ? (
            <Box
              ref={(element) => setActionContainer(element as HTMLDivElement)}
            >
              {secondaryAction}
            </Box>
          ) : undefined
        }
        disablePadding
        sx={sx}
        {...listItemProps}
      >
        <ListItemButton
          onClick={onClick}
          {...listItemButtonProps}
          sx={(theme) => ({
            pr: `calc(${theme.spacing(2)} + ${actionWidth ?? 0}px) !important`,
          })}
        >
          {children}
        </ListItemButton>
      </ListItem>
    );
  }
  return (
    <ListItem
      secondaryAction={
        secondaryAction ? (
          <Box ref={(element) => setActionContainer(element as HTMLDivElement)}>
            {secondaryAction}
          </Box>
        ) : undefined
      }
      {...listItemProps}
      sx={[{}, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </ListItem>
  );
}
