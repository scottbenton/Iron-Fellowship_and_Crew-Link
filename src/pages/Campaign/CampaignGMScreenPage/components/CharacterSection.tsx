import { Grid } from "@mui/material";
import { useCampaignGMScreenStore } from "../campaignGMScreen.store";
import { CharacterCard } from "./CharacterCard";

export function CharacterSection() {
  const characters = useCampaignGMScreenStore((store) => store.characters);
  const campaignCharacters = useCampaignGMScreenStore(
    (store) => store.campaign?.characters
  );

  const findUidFromCharacterId = (characterId: string) => {
    const uid = campaignCharacters?.find((character) => {
      return character.characterId === characterId;
    })?.uid;

    return uid;
  };

  return (
    <Grid container spacing={2} p={2}>
      {Object.keys(characters).map((characterId) => (
        <Grid item key={characterId} xs={12} md={12} lg={6}>
          <CharacterCard
            uid={findUidFromCharacterId(characterId) ?? ""}
            characterId={characterId}
            character={characters[characterId]}
          />
        </Grid>
      ))}
    </Grid>
  );
}
