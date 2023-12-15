import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { LinkComponent } from "components/shared/LinkComponent";
import { constructHomebrewEditorPath } from "pages/Homebrew/routes";
import { useStore } from "stores/store";
import { FlyoutMenuList } from "./FlyoutMenuList";

export function HomebrewMenu() {
  const homebrewCollections = useStore((store) => store.homebrew.collections);
  return (
    <FlyoutMenuList
      label={"Homebrew"}
      itemIds={Object.keys(homebrewCollections)}
      renderListItem={(collectionId) => (
        <ListItem key={collectionId} disablePadding>
          <ListItemButton
            LinkComponent={LinkComponent}
            href={constructHomebrewEditorPath(collectionId)}
          >
            <ListItemText
              primary={
                homebrewCollections[collectionId].title ?? "Unnamed Collection"
              }
            />
          </ListItemButton>
        </ListItem>
      )}
    />
  );
}
