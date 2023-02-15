import {
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Box,
  ListItemIcon,
} from "@mui/material";
import OpenIcon from "@mui/icons-material/ChevronRight";
import { Move, MoveCategory as IMoveCategory } from "../../types/Moves.type";

export interface MoveCategoryProps {
  category: IMoveCategory;
  openMove: (move: Move) => void;
}

export function MoveCategory(props: MoveCategoryProps) {
  const { category, openMove } = props;
  return (
    <List disablePadding>
      <ListSubheader
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.light,
          color: "white",
          ...theme.typography.body1,
          fontFamily: theme.fontFamilyTitle,
        })}
      >
        {category.categoryName}
      </ListSubheader>
      {category.moves.map((move, index) => (
        <ListItem
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
              {move.name}
            </Box>
            <ListItemIcon sx={{ minWidth: "unset" }}>
              <OpenIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
