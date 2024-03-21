import { Datasworn } from "@datasworn/core";
import { Box, ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import OpenIcon from "@mui/icons-material/ChevronRight";

export interface MoveProps {
  move: Datasworn.Move;
  openMove: (move: Datasworn.Move) => void;
  disabled?: boolean;
}

export function Move(props: MoveProps) {
  const { move, openMove, disabled } = props;

  return (
    <ListItem
      id={move._id}
      sx={(theme) => ({
        "&:nth-of-type(even)": {
          backgroundColor: theme.palette.background.paperInlay,
        },
      })}
      disablePadding
    >
      <ListItemButton
        disabled={disabled}
        onClick={() => openMove(move)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={(theme) => ({
            ...theme.typography.body2,
            color: theme.palette.text.primary,
          })}
        >
          {move.name}
        </Box>
        <ListItemIcon sx={{ minWidth: "unset" }}>
          <OpenIcon />
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
}
