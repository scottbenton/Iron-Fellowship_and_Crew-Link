import { Button, Grid } from "@mui/material";
import { CharacterList } from "components/features/characters/CharacterList";
import { EmptyState } from "components/shared/EmptyState/EmptyState";
import { SectionHeading } from "components/shared/SectionHeading";
import { useState } from "react";
import { Link } from "react-router-dom";
import { StoredCampaign } from "types/Campaign.type";
import { AddCharacterDialog } from "./AddCharacterDialog";
import { constructCharacterSheetPath } from "pages/Character/routes";
import { useStore } from "stores/store";
import { PlayerCard } from "./PlayerCard";

export interface CharacterSectionProps {
  campaign: StoredCampaign;
  campaignId: string;
}

export function CharacterSection(props: CharacterSectionProps) {
  const { campaign, campaignId } = props;

  const uid = useStore((store) => store.auth.uid);
  const isUserGM = useStore((store) =>
    store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
      store.auth.uid
    )
  );

  const [addCharacterDialogOpen, setAddCharacterDialogOpen] =
    useState<boolean>(false);

  const characters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );

  const players = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.users ?? []
  );

  const removeCharacterFromCampaign = useStore(
    (store) => store.campaigns.currentCampaign.removeCharacter
  );

  const getUidFromCharacterId = (characterId: string) => {
    return Object.values(campaign.characters).find(
      (character) => character.characterId === characterId
    )?.uid;
  };

  return (
    <>
      <SectionHeading
        label={"Characters"}
        action={
          <div>
            <Button
              color={"inherit"}
              variant={"outlined"}
              sx={{ ml: 1 }}
              onClick={() => setAddCharacterDialogOpen(true)}
            >
              Add a Character
            </Button>
          </div>
        }
        breakContainer
        sx={{ mb: 3 }}
      />
      {campaign.characters.length === 0 && (
        <EmptyState
          showImage
          title={"No Characters"}
          message={"Add a character to the campaign to get started"}
          callToAction={
            <Button
              variant={"contained"}
              onClick={() => setAddCharacterDialogOpen(true)}
            >
              Add a Character
            </Button>
          }
        />
      )}
      <CharacterList
        usePlayerNameAsSecondaryText
        characters={characters}
        actions={(characterId) => (
          <>
            {getUidFromCharacterId(characterId) === uid && (
              <Button
                color={"inherit"}
                component={Link}
                to={constructCharacterSheetPath(characterId)}
              >
                View
              </Button>
            )}
            {(getUidFromCharacterId(characterId) === uid || isUserGM) && (
              <Button
                color={"error"}
                onClick={() =>
                  removeCharacterFromCampaign(
                    getUidFromCharacterId(characterId) ?? "",
                    characterId
                  )
                }
              >
                Remove from Campaign
              </Button>
            )}
          </>
        )}
      />
      <AddCharacterDialog
        open={addCharacterDialogOpen}
        handleClose={() => setAddCharacterDialogOpen(false)}
        campaignId={campaignId}
      />
      <SectionHeading label={"Players"} breakContainer sx={{ mt: 5 }} />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {players.map((playerId) => (
          <Grid item xs={12} sm={6} md={4} key={playerId}>
            <PlayerCard playerId={playerId} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
