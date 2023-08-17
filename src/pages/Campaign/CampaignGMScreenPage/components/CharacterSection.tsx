import { Grid } from "@mui/material";
import { CharacterCard } from "./CharacterCard";
import { useStore } from "stores/store";

export function CharacterSection() {
  const campaignCharacters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );

  const findUidFromCharacterId = (characterId: string) => {
    return campaignCharacters[characterId].uid;
  };

  return (
    <Grid container spacing={2} p={2}>
      {Object.keys(campaignCharacters).map((characterId) => (
        <Grid item key={characterId} xs={12} md={12} lg={6}>
          <CharacterCard
            uid={findUidFromCharacterId(characterId) ?? ""}
            characterId={characterId}
            character={campaignCharacters[characterId]}
          />
        </Grid>
      ))}
    </Grid>
  );
}
