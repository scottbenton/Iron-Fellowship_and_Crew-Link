import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import { StatComponent } from "components/features/characters/StatComponent";
import { CharacterDocument, INITIATIVE_STATUS } from "types/Character.type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AssetCard as OldAssetCard } from "components/features/assets/AssetCard";
import { AssetCard } from "components/features/assets/NewAssetCard";
import { InitiativeStatusChip } from "components/features/characters/InitiativeStatusChip";
import { PortraitAvatar } from "components/features/characters/PortraitAvatar/PortraitAvatar";
import { Stat } from "types/stats.enum";
import { useStore } from "stores/store";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { IronswornTracks } from "./IronswornTracks";
import { LegacyTracks } from "./LegacyTracks";
import { useNewCustomContentPage } from "hooks/featureFlags/useNewCustomContentPage";
import { getNewDataswornId, getOldDataswornId } from "data/assets";

export interface CharacterCardProps {
  uid: string;
  characterId: string;
  character: CharacterDocument;
}

export function CharacterCard(props: CharacterCardProps) {
  const { uid, characterId, character } = props;

  const showNewExpansions = useNewCustomContentPage();
  const stats = useStore((store) => store.rules.stats);
  const conditionMeters = useStore((store) => store.rules.conditionMeters);

  const trackLabel = useGameSystemValue<string>({
    [GAME_SYSTEMS.IRONSWORN]: showNewExpansions
      ? "XP and Legacy Tracks"
      : "XP and Bonds",
    [GAME_SYSTEMS.STARFORGED]: "Legacy Tracks",
  });
  const TrackComponent = useGameSystemValue<
    (props: { characterId: string }) => JSX.Element
  >({
    [GAME_SYSTEMS.IRONSWORN]: IronswornTracks,
    [GAME_SYSTEMS.STARFORGED]: LegacyTracks,
  });

  const storedAssets = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.characterAssets[characterId]
  );

  const customStats = useStore((store) => store.settings.customStats);
  const customTracks = useStore((store) =>
    store.settings.customTracks.filter((track) => track.rollable)
  );
  const customTrackValues = character.customTracks ?? {};

  const user = useStore((store) => store.users.userMap[uid]?.doc);
  const updateCharacter = useStore(
    (store) => store.campaigns.currentCampaign.characters.updateCharacter
  );

  const updateCharacterInitiative = (initiativeStatus: INITIATIVE_STATUS) => {
    updateCharacter(characterId, { initiativeStatus }).catch(() => {});
  };

  const showNewAssetCards = useNewCustomContentPage();

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
            <Typography variant={"subtitle1"} mt={-1} color={"textSecondary"}>
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
            variant={"outlined"}
          />
        </Box>
        <Box display={"flex"} px={2} flexWrap={"wrap"}>
          {showNewExpansions ? (
            <>
              {Object.keys(stats).map((statKey) => (
                <StatComponent
                  key={statKey}
                  label={stats[statKey].label}
                  value={character.stats[statKey] ?? 0}
                  sx={{ mr: 1, mt: 1 }}
                  disableRoll
                />
              ))}
            </>
          ) : (
            <>
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
              {customStats.map((customStat) => (
                <StatComponent
                  key={customStat}
                  label={customStat}
                  value={character.stats[customStat] ?? 0}
                  sx={{ mr: 1, mt: 1 }}
                  disableRoll
                />
              ))}
            </>
          )}
        </Box>
        <Box display={"flex"} px={2} pb={2}>
          {showNewExpansions ? (
            <>
              {Object.keys(conditionMeters)
                .filter((cm) => !conditionMeters[cm].shared)
                .map((cm) => (
                  <StatComponent
                    key={cm}
                    label={conditionMeters[cm].label}
                    value={
                      character.conditionMeters?.[cm] ??
                      conditionMeters[cm].value
                    }
                    sx={{ mr: 1, mt: 1 }}
                    disableRoll
                  />
                ))}
            </>
          ) : (
            <>
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
              {customTracks.map((customTrack) => {
                const index = customTrackValues[customTrack.label];
                const value =
                  index !== undefined &&
                  typeof customTrack.values[index].value === "number"
                    ? (customTrack.values[index].value as number)
                    : 0;

                return (
                  <StatComponent
                    key={customTrack.label}
                    label={customTrack.label}
                    value={value}
                    disableRoll
                    sx={{ mr: 1, mt: 1 }}
                  />
                );
              })}
            </>
          )}

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
              {storedAssets?.map((storedAsset, index) =>
                showNewAssetCards ? (
                  <AssetCard
                    key={index}
                    storedAsset={storedAsset}
                    assetId={getNewDataswornId(storedAsset.id)}
                  />
                ) : (
                  <OldAssetCard
                    key={index}
                    storedAsset={storedAsset}
                    assetId={getOldDataswornId(storedAsset.id)}
                  />
                )
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {trackLabel}
          </AccordionSummary>
          <AccordionDetails>
            <TrackComponent characterId={characterId} />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Card>
  );
}
