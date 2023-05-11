import { Button } from "@mui/material";
import { removeCharacterFromCampaign } from "api/campaign/removeCharacterFromCampaign";
import { useListenToCampaignCharacters } from "api/characters/listenToCampaignCharacters";
import { CharacterList } from "components/CharacterList";
import { EmptyState } from "components/EmptyState/EmptyState";
import { SectionHeading } from "components/SectionHeading";
import { useAuth } from "providers/AuthProvider";
import { useState } from "react";
import { Link } from "react-router-dom";
import { StoredCampaign } from "types/Campaign.type";
import { AddCharacterDialog } from "./AddCharacterDialog";
import { constructCharacterSheetPath } from "pages/Character/routes";

export interface CharacterSectionProps {
  campaign: StoredCampaign;
  campaignId: string;
}

export function CharacterSection(props: CharacterSectionProps) {
  const { campaign, campaignId } = props;

  const uid = useAuth().user?.uid;

  const [addCharacterDialogOpen, setAddCharacterDialogOpen] =
    useState<boolean>(false);

  const campaignCharacters = useListenToCampaignCharacters(campaignId);

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
        characters={campaignCharacters}
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
                onClick={() =>
                  removeCharacterFromCampaign({ campaignId, characterId })
                }
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
