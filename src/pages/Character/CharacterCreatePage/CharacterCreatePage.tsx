import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";
import { CharacterCreatePageContent } from "./CharacterCreatePageContent";
import { OldCharacterCreatePageContent } from "./OldCharacterCreatePageContent";

export function CharacterCreatePage() {
  const isUsingNewHomebrew = useNewCustomContentPage();

  if (isUsingNewHomebrew) {
    return <CharacterCreatePageContent />;
  }
  return <OldCharacterCreatePageContent />;
}
