import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
} from "@mui/material";
import { Move, MoveCategory as IMoveCategory } from "dataforged";
import OpenIcon from "@mui/icons-material/ChevronRight";

export interface MoveCategoryProps {
  category: IMoveCategory;
  openMove: (move: Move) => void;
}

export function MoveCategory(props: MoveCategoryProps) {
  const { category, openMove } = props;

  return (
    <>
      <ListSubheader
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.light,
          color: "white",
          ...theme.typography.body1,
          fontFamily: theme.fontFamilyTitle,
        })}
      >
        {category.Title.Standard}
      </ListSubheader>
      {Object.values(category.Moves).map((move, index) => (
        <ListItem
          id={move.$id}
          key={index}
          sx={(theme) => ({
            "&:nth-of-type(odd)": {
              backgroundColor: theme.palette.action.hover,
            },
          })}
          disablePadding
        >
          <ListItemButton
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
              {move.Title.Standard}
            </Box>
            <ListItemIcon sx={{ minWidth: "unset" }}>
              <OpenIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
}
