import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import { StatComponent } from "components/StatComponent";
import { CharacterDocument, INITIATIVE_STATUS } from "types/Character.type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AssetCard } from "components/AssetCard/AssetCard";
import { InitiativeStatusChip } from "components/InitiativeStatusChip";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import { Stat } from "types/stats.enum";
import { useStore } from "stores/store";
import { useState } from "react";

export interface CharacterCardProps {
  uid: string;
  characterId: string;
  character: CharacterDocument;
}

export function CharacterCard(props: CharacterCardProps) {
  const { uid, characterId, character } = props;

  const storedAssets = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterAssets[characterId]
  );

  const user = useStore((store) => store.users.userMap[uid]?.doc);
  const updateCharacter = useStore(
    (store) => store.campaigns.currentCampaign.characters.updateCharacter
  );
  const [
    updateCharacterInitiativeLoading,
    setUpdateCharacterInitiativeLoading,
  ] = useState(false);
  const updateCharacterInitiative = (initiativeStatus: INITIATIVE_STATUS) => {
    setUpdateCharacterInitiativeLoading(true);
    updateCharacter(characterId, { initiativeStatus })
      .catch(() => {})
      .finally(() => {
        setUpdateCharacterInitiativeLoading(false);
      });
  };

  return (
    <Card variant={"outlined"}>
      <Box>
        <Box display={"flex"} alignItems={"center"} px={2} pt={2} pb={1}>
          <PortraitAvatar
            uid={uid}
            characterId={characterId}
            name={character.name}
            portraitSettings={character.profileImage}
            colorful
            size={"medium"}
          />
          <Box display={"flex"} flexDirection={"column"} ml={2}>
            <Typography
              variant={"h6"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              {character.name}
            </Typography>
            <Typography variant={"subtitle1"} mt={-1} color={"GrayText"}>
              {user ? user.displayName : "Loading..."}
            </Typography>
          </Box>
        </Box>
        <Box px={2}>
          <InitiativeStatusChip
            status={
              character.initiativeStatus ?? INITIATIVE_STATUS.OUT_OF_COMBAT
            }
            handleStatusChange={updateCharacterInitiative}
            loading={updateCharacterInitiativeLoading}
            variant={"outlined"}
          />
        </Box>
        <Box display={"flex"} px={2} flexWrap={"wrap"}>
          <StatComponent
            label={"Edge"}
            value={character.stats[Stat.Edge]}
            sx={{ mr: 1, mt: 1 }}
            disableRoll
          />
          <StatComponent
            label={"Heart"}
            value={character.stats[Stat.Heart]}
            sx={{ mr: 1, mt: 1 }}
            disableRoll
          />
          <StatComponent
            label={"Iron"}
            value={character.stats[Stat.Iron]}
            sx={{ mr: 1, mt: 1 }}
            disableRoll
          />
          <StatComponent
            label={"Shadow"}
            value={character.stats[Stat.Shadow]}
            sx={{ mr: 1, mt: 1 }}
            disableRoll
          />
          <StatComponent
            label={"Wits"}
            value={character.stats[Stat.Wits]}
            sx={{ mr: 1, mt: 1 }}
            disableRoll
          />
        </Box>
        <Box display={"flex"} px={2} pb={2}>
          <StatComponent
            label={"Health"}
            value={character.health}
            disableRoll
            sx={{ mr: 1, mt: 1 }}
          />
          <StatComponent
            label={"Spirit"}
            value={character.spirit}
            disableRoll
            sx={{ mr: 1, mt: 1 }}
          />
          <StatComponent
            label={"Momentum"}
            value={character.momentum}
            disableRoll
            sx={{ mr: 1, mt: 1 }}
          />
        </Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Assets
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2} px={2}>
              {storedAssets?.map((storedAsset, index) => (
                <AssetCard
                  key={index}
                  storedAsset={storedAsset}
                  assetId={storedAsset.id}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Notes
          </AccordionSummary>
          <AccordionDetails>
            {character.shareNotesWithGM ? (
              <CharacterNotesComponent uid={uid} characterId={characterId} />
            ) : (
              <Typography>
                {user?.displayName ?? "User"} has not opted-in to sharing their
                character notes with you. They can change this under the
                character tab on their character sheet.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion> */}
      </Box>
    </Card>
  );
}
