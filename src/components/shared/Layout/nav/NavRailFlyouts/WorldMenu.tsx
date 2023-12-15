import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { LinkComponent } from "components/shared/LinkComponent";
import { constructWorldSheetPath } from "pages/World/routes";
import { useStore } from "stores/store";
import { FlyoutMenuList } from "./FlyoutMenuList";

export function WorldMenu() {
  const worlds = useStore((store) => store.worlds.worldMap);
  return (
    <FlyoutMenuList
      label={"Worlds"}
      itemIds={Object.keys(worlds)}
      renderListItem={(worldId) => (
        <ListItem key={worldId} disablePadding>
          <ListItemButton
            LinkComponent={LinkComponent}
            href={constructWorldSheetPath(worldId)}
          >
            <ListItemText primary={worlds[worldId].name} />
          </ListItemButton>
        </ListItem>
      )}
    />
  );
}
