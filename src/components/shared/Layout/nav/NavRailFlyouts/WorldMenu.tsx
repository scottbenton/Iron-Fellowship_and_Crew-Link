import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { LinkComponent } from "components/shared/LinkComponent";
import { constructWorldSheetPath } from "pages/World/routes";
import { useStore } from "stores/store";

export function WorldMenu() {
  const worlds = useStore((store) => store.worlds.worldMap);
  return (
    <>
      <Typography variant={"h6"} component={"p"} px={2}>
        Worlds
      </Typography>
      <List>
        {Object.keys(worlds).map((worldId) => (
          <ListItem key={worldId} disablePadding>
            <ListItemButton
              LinkComponent={LinkComponent}
              href={constructWorldSheetPath(worldId)}
            >
              <ListItemText primary={worlds[worldId].name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
