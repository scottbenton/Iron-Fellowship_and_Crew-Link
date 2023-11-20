import { PortraitAvatar } from "components/features/characters/PortraitAvatar/PortraitAvatar";
import { useStore } from "stores/store";

export function CharacterPortrait() {
  const uid = useStore((store) => store.auth.uid);
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId ?? ""
  );
  const characterName = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name ?? ""
  );

  const characterPortraitSettings = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.profileImage
  );

  return (
    <PortraitAvatar
      uid={uid}
      characterId={characterId}
      name={characterName}
      portraitSettings={characterPortraitSettings}
    />
  );
}
