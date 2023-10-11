import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { StoredMove } from "types/Moves.type";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibleIcon from "@mui/icons-material/Visibility";
import HiddenIcon from "@mui/icons-material/VisibilityOff";

export interface CustomMoveListItemProps {
  move: StoredMove;
  handleEdit: () => void;
  handleDelete: () => void;
  handleVisibilityToggle: (isVisible: boolean) => void;
  isVisible: boolean;
}

export function CustomMoveListItem(props: CustomMoveListItemProps) {
  const { move, handleEdit, handleDelete, handleVisibilityToggle, isVisible } =
    props;

  return (
    <ListItem
      dense
      key={move.name}
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "&:nth-of-type(even)": {
          backgroundColor: theme.palette.action.hover,
        },
      })}
    >
      <ListItemText>
        {!isVisible && "(Hidden) "}
        {move.name}
      </ListItemText>
      <Box>
        <Tooltip title={"Edit this move"}>
          <IconButton onClick={() => handleEdit()}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Toggle visibility for this campaign or character"}>
          <IconButton onClick={() => handleVisibilityToggle(!isVisible)}>
            {isVisible ? <HiddenIcon /> : <VisibleIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={"Delete this move"}>
          <IconButton onClick={() => handleDelete()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  );
}
