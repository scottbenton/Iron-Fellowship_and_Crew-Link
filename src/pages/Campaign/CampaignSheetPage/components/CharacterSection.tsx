import { Button } from "@mui/material";
import { CharacterList } from "components/CharacterList";
import { EmptyState } from "components/EmptyState/EmptyState";
import { SectionHeading } from "components/SectionHeading";
import { useAuth } from "providers/AuthProvider";
import { useState } from "react";
import { Link } from "react-router-dom";
import { StoredCampaign } from "types/Campaign.type";
import { AddCharacterDialog } from "./AddCharacterDialog";
import { constructCharacterSheetPath } from "pages/Character/routes";
import { useStore } from "stores/store";

export interface CharacterSectionProps {
  campaign: StoredCampaign;
  campaignId: string;
}

export function CharacterSection(props: CharacterSectionProps) {
  const { campaign, campaignId } = props;

  const uid = useAuth().user?.uid;

  const [addCharacterDialogOpen, setAddCharacterDialogOpen] =
    useState<boolean>(false);

  const characters = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignCharacters
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
              variant={"contained"}
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
          imageSrc="/assets/nature.svg"
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
        actions={(characterId) =>
          getUidFromCharacterId(characterId) === uid ? (
            <>
              <Button
                component={Link}
                to={constructCharacterSheetPath(characterId)}
              >
                View
              </Button>
              <Button
                color={"error"}
                onClick={() => removeCharacterFromCampaign(characterId)}
              >
                Remove from Campaign
              </Button>
            </>
          ) : (
            <></>
          )
        }
      />
      <AddCharacterDialog
        open={addCharacterDialogOpen}
        handleClose={() => setAddCharacterDialogOpen(false)}
        campaignId={campaignId}
      />
    </>
  );
}
