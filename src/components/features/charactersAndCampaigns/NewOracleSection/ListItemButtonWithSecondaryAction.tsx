import {
  Box,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemProps,
} from "@mui/material";
import { useEffect, useState } from "react";

export interface ListItemButtonWithSecondaryActionProps extends ListItemProps {
  onClick?: () => void;
  disabled?: boolean;
  listItemButtonProps?: ListItemButtonProps;
}

export function ListItemButtonWithSecondaryAction(
  props: ListItemButtonWithSecondaryActionProps
) {
  const {
    onClick,
    disabled,
    listItemButtonProps,
    children,
    secondaryAction,
    ...listItemProps
  } = props;

  const [actionContainer, setActionContainer] = useState<HTMLDivElement>();
  const [actionWidth, setActionWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((elements) => {
      elements.forEach((element) => {
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

  return (
    <ListItem
      secondaryAction={
        secondaryAction ? (
          <Box ref={(element) => setActionContainer(element as HTMLDivElement)}>
            {secondaryAction}
          </Box>
        ) : undefined
      }
      disablePadding
      sx={{
        "&:nth-of-type(even)": {
          bgcolor: "background.paperInlay",
        },
      }}
      {...listItemProps}
    >
      <ListItemButton
        disabled={disabled}
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
