import { Box, Grid } from "@mui/material";
import { useListenToCampaignCharacters } from "api/characters/listenToCampaignCharacters";
import { StoredCampaign } from "types/Campaign.type";
import { CharacterCard } from "./CharacterCard";

export interface CharacterSectionProps {
  campaignId: string;
  campaign: StoredCampaign;
}

export function CharacterSection(props: CharacterSectionProps) {
  const { campaignId, campaign } = props;

  const characters = useListenToCampaignCharacters(campaignId);

  const findUidFromCharacterId = (characterId: string) => {
    const uid = campaign.characters.find((character) => {
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
