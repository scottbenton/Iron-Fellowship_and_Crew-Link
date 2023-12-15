import {
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { PortraitAvatar } from "components/features/characters/PortraitAvatar/PortraitAvatar";
import { LinkComponent } from "components/shared/LinkComponent";
import { constructCharacterSheetPath } from "pages/Character/routes";
import { useStore } from "stores/store";
import { FlyoutMenuList } from "./FlyoutMenuList";

export function CharacterMenu() {
  const characters = useStore((store) => store.characters.characterMap);

  return (
    <FlyoutMenuList
      label={"Characters"}
      itemIds={Object.keys(characters)}
      renderListItem={(characterId) => (
        <ListItem key={characterId} disablePadding>
          <ListItemButton
            LinkComponent={LinkComponent}
            href={constructCharacterSheetPath(characterId)}
          >
            <ListItemAvatar>
              <PortraitAvatar
                size={"small"}
                uid={characters[characterId].uid}
                characterId={characterId}
                name={characters[characterId].name}
                portraitSettings={characters[characterId].profileImage}
                colorful
              />
            </ListItemAvatar>
            <ListItemText primary={characters[characterId].name} />
          </ListItemButton>
        </ListItem>
      )}
    />
  );
}
