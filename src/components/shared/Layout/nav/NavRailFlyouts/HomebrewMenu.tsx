import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { LinkComponent } from "components/shared/LinkComponent";
import { constructHomebrewEditorPath } from "pages/Homebrew/routes";
import { useStore } from "stores/store";

export function HomebrewMenu() {
  const homebrewCollections = useStore((store) => store.homebrew.collections);
  return (
    <>
      <Typography variant={"h6"} component={"p"} px={2}>
        Homebrew
      </Typography>
      <List>
        {Object.keys(homebrewCollections).map((collectionId) => (
          <ListItem key={collectionId} disablePadding>
            <ListItemButton
              LinkComponent={LinkComponent}
              href={constructHomebrewEditorPath(collectionId)}
            >
              <ListItemText
                primary={
                  homebrewCollections[collectionId].title ??
                  "Unnamed Collection"
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
