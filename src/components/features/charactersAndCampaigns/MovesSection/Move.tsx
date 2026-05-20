import { Datasworn } from "@datasworn/core";
import {
  Box,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import OpenIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { MoveContent } from "components/features/datasworn/MoveContent";

export interface MoveProps {
  move: Datasworn.Move;
  openMove: (move: Datasworn.Move) => void;
  disabled?: boolean;
  shouldExpandLocally?: boolean;
}

export function Move(props: MoveProps) {
  const { move, openMove, disabled, shouldExpandLocally } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
          onClick={() =>
            shouldExpandLocally
              ? setIsOpen((prevOpen) => !prevOpen)
              : openMove(move)
          }
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
            <OpenIcon
              sx={(theme) => ({
                transform: `rotate(${isOpen ? "90deg" : "0deg"})`,
                transition: theme.transitions.create(["transform"], {
                  duration: theme.transitions.duration.shorter,
                }),
              })}
            />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen}>
        <Box
          bgcolor="background.paper"
          p={2}
          borderTop={1}
          borderBottom={1}
          borderColor={"divider"}
        >
          <MoveContent move={move} />
        </Box>
      </Collapse>
    </>
  );
}
