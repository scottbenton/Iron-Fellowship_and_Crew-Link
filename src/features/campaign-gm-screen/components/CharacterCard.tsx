import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import { StatComponent } from "components/StatComponent";
import { getHueFromString } from "functions/getHueFromString";
import { CharacterDocument, INITIATIVE_STATUS } from "types/Character.type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useListenToAssets } from "api/characters/assets/listenToAssets";
import { useState } from "react";
import { StoredAsset } from "types/Asset.type";
import { AssetCard } from "components/AssetCard/AssetCard";
import { assets } from "data/assets";
import { STATS } from "types/stats.enum";
import { useGetUserDoc, useUserDoc } from "api/user/getUserDoc";
import { InitiativeStatusChip } from "components/InitiativeStatusChip";
import { useUpdateCharacterInitiative } from "api/characters/updateCharacterInitiative";
import { CharacterNotesComponent } from "./CharacterNotesComponent";
import { PortraitAvatar } from "components/PortraitAvatar/PortraitAvatar";
import { CharacterDocumentWithPortraitUrl } from "stores/character.store";
import { useCampaignGMScreenStore } from "../campaignGMScreen.store";

export interface CharacterCardProps {
  uid: string;
  characterId: string;
  character: CharacterDocumentWithPortraitUrl;
}

export function CharacterCard(props: CharacterCardProps) {
  const { uid, characterId, character } = props;

  const storedAssets = useCampaignGMScreenStore(
    (store) => store.characterAssets[characterId]
  );

  const user = useCampaignGMScreenStore((store) => store.players[uid]);

  const { updateCharacterInitiative, loading: initiativeLoading } =
    useUpdateCharacterInitiative();

  return (
    <Card variant={"outlined"}>
      <Box>
        <Box display={"flex"} alignItems={"center"} px={2} pt={2} pb={1}>
          <PortraitAvatar
            id={characterId}
            name={character.name}
            portraitUrl={character.portraitUrl}
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
            handleStatusChange={(initiativeStatus) =>
              updateCharacterInitiative({
                uid,
                characterId,
                initiativeStatus,
              }).catch()
            }
            loading={initiativeLoading}
            variant={"outlined"}
          />
        </Box>
        <Box display={"flex"} px={2} flexWrap={"wrap"}>
          <StatComponent
            label={"Edge"}
            value={character.stats[STATS.EDGE]}
            sx={{ mr: 1, mt: 1 }}
            disableRoll
          />
          <StatComponent
            label={"Heart"}
            value={character.stats[STATS.HEART]}
            sx={{ mr: 1, mt: 1 }}
            disableRoll
          />
          <StatComponent
            label={"Iron"}
            value={character.stats[STATS.IRON]}
            sx={{ mr: 1, mt: 1 }}
            disableRoll
          />
          <StatComponent
            label={"Shadow"}
            value={character.stats[STATS.SHADOW]}
            sx={{ mr: 1, mt: 1 }}
            disableRoll
          />
          <StatComponent
            label={"Wits"}
            value={character.stats[STATS.WITS]}
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
                  asset={storedAsset.customAsset ?? assets[storedAsset.id]}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Accordion>
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
        </Accordion>
      </Box>
    </Card>
  );
}
