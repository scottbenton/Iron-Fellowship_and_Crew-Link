import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import { StatComponent } from "components/features/characters/StatComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AssetCard } from "components/features/assets/AssetCard";
import { InitiativeStatusChip } from "components/features/characters/InitiativeStatusChip";
import { PortraitAvatar } from "components/features/characters/PortraitAvatar/PortraitAvatar";
import { useStore } from "stores/store";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { IronswornTracks } from "./IronswornTracks";
import { LegacyTracks } from "./LegacyTracks";
import {
  CharacterDocument,
  InitiativeStatus,
} from "api-calls/character/_character.type";
import { LinkComponent } from "components/shared/LinkComponent";
import { constructCharacterSheetPath } from "pages/Character/routes";
import { useCampaignType } from "hooks/useCampaignType";

export interface CharacterCardProps {
  uid: string;
  characterId: string;
  character: CharacterDocument;
}

export function CharacterCard(props: CharacterCardProps) {
  const { uid, characterId, character } = props;

  const currentUserUid = useStore((store) => store.auth.uid);

  const stats = useStore((store) => store.rules.stats);
  const conditionMeters = useStore((store) => store.rules.conditionMeters);

  const trackLabel = useGameSystemValue<string>({
    [GAME_SYSTEMS.IRONSWORN]: "XP and Bonds",
    [GAME_SYSTEMS.STARFORGED]: "Legacy Tracks",
  });
  const TrackComponent = useGameSystemValue<
    (props: { characterId: string }) => JSX.Element
  >({
    [GAME_SYSTEMS.IRONSWORN]: IronswornTracks,
    [GAME_SYSTEMS.STARFORGED]: LegacyTracks,
  });

  const { showGuidedPlayerView } = useCampaignType();

  const storedAssets = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterAssets[characterId]
  );

  const user = useStore((store) => store.users.userMap[uid]?.doc);
  const updateCharacter = useStore(
    (store) => store.campaigns.currentCampaign.characters.updateCharacter
  );

  const updateCharacterInitiative = (initiativeStatus: InitiativeStatus) => {
    updateCharacter(characterId, { initiativeStatus }).catch(() => {});
  };

  const removeCharacterFromCampaign = useStore(
    (store) => store.campaigns.currentCampaign.removeCharacter
  );

  return (
    <Card variant={"outlined"}>
      <Box>
        <Box
          display={"flex"}
          alignItems={"start"}
          justifyContent={"space-between"}
          px={2}
          pt={2}
          pb={1}
        >
          <Box display={"flex"} alignItems={"center"}>
            <PortraitAvatar
              uid={uid}
              characterId={characterId}
              name={character.name}
              portraitSettings={character.profileImage ?? undefined}
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
              <Typography variant={"subtitle1"} mt={-1} color={"textSecondary"}>
                {user ? user.displayName : "Loading..."}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box px={2}>
          <InitiativeStatusChip
            status={character.initiativeStatus ?? InitiativeStatus.OutOfCombat}
            handleStatusChange={
              !showGuidedPlayerView || uid === currentUserUid
                ? updateCharacterInitiative
                : undefined
            }
          />
        </Box>
        <Box display={"flex"} px={2} flexWrap={"wrap"}>
          {Object.keys(stats).map((statKey) => (
            <StatComponent
              key={statKey}
              label={stats[statKey].label}
              value={character.stats[statKey] ?? 0}
              sx={{ mr: 1, mt: 1 }}
              disableRoll
            />
          ))}
        </Box>
        <Box display={"flex"} px={2} pb={2}>
          {Object.keys(conditionMeters)
            .filter((cm) => !conditionMeters[cm].shared)
            .map((cm) => (
              <StatComponent
                key={cm}
                label={conditionMeters[cm].label}
                value={
                  character.conditionMeters?.[cm] ?? conditionMeters[cm].value
                }
                sx={{ mr: 1, mt: 1 }}
                disableRoll
              />
            ))}
          <StatComponent
            label={"Momentum"}
            value={character.momentum}
            disableRoll
            sx={{ mr: 1, mt: 1 }}
          />
        </Box>
        <Accordion
          variant={"outlined"}
          sx={{ borderLeftWidth: 0, borderRightWidth: 0 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Assets
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
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
        <Accordion
          variant="outlined"
          sx={{ borderLeftWidth: 0, borderRightWidth: 0 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {trackLabel}
          </AccordionSummary>
          <AccordionDetails>
            <TrackComponent characterId={characterId} />
          </AccordionDetails>
        </Accordion>
        <Box display={"flex"} justifyContent={"flex-end"} p={1}>
          <Stack direction={"row"} spacing={1} flexWrap={"wrap"}>
            {(uid === currentUserUid || !showGuidedPlayerView) && (
              <Button
                color={"error"}
                onClick={() => removeCharacterFromCampaign(uid, characterId)}
              >
                Remove Character
              </Button>
            )}
            {uid === currentUserUid && (
              <Button
                color={"inherit"}
                LinkComponent={LinkComponent}
                href={constructCharacterSheetPath(characterId)}
              >
                Open Sheet
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Card>
  );
}
