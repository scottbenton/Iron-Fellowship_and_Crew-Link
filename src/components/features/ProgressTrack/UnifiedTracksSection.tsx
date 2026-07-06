import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";
import { SectionHeading } from "components/shared/SectionHeading";
import { Clock } from "components/features/charactersAndCampaigns/Clocks/Clock";
import { ClockDialog } from "components/features/charactersAndCampaigns/Clocks/ClockDialog";
import { useCampaignType } from "hooks/useCampaignType";
import { useGameSystem } from "hooks/useGameSystem";
import { useIsMobile } from "hooks/useIsMobile";
import { useMemo, useRef, useState } from "react";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import {
  ProgressTrack as IProgressTrack,
  SceneChallenge,
  Track,
  TrackSectionProgressTracks,
  TrackSectionTracks,
  TrackStatus,
  TrackTypes,
} from "types/Track.type";
import { EditOrCreateTrackDialog } from "./EditOrCreateTrackDialog";
import { ProgressTrack } from "./ProgressTrack";
import {
  getAvailableTrackTypes,
  getTrackTypeLabel,
} from "./trackTypeLabels";

type CreateSource = "campaign" | "character";
type UnifiedTrackSectionMode = "campaign" | "character";

type TrackMapByType = Record<TrackSectionTracks, Record<string, Track>>;

interface UnifiedTrackItem {
  key: string;
  id: string;
  track: Track;
  sourceLabel: string;
  allowEdit: boolean;
  allowDelete: boolean;
  updateTrack?: (trackId: string, track: Partial<Track>) => Promise<void>;
  deleteTrack?: (trackId: string) => Promise<void>;
}

export interface UnifiedTracksSectionProps {
  mode: UnifiedTrackSectionMode;
  headingBreakContainer?: boolean;
}

const allTrackTypes: TrackSectionTracks[] = [
  TrackTypes.Fray,
  TrackTypes.Journey,
  TrackTypes.Vow,
  TrackTypes.DelveSite,
  TrackTypes.SceneChallenge,
  TrackTypes.Clock,
];

export function UnifiedTracksSection(props: UnifiedTracksSectionProps) {
  const { mode, headingBreakContainer } = props;

  const isStarforged = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;
  const isIronsworn = useGameSystem().gameSystem === GAME_SYSTEMS.IRONSWORN;
  const isDelveEnabled = useStore((store) =>
    store.rules.expansionIds.includes("delve")
  );
  const isLodestarEnabled = useStore((store) =>
    store.rules.expansionIds.includes("lodestar")
  );
  const isInCampaign = useStore(
    (store) => !!store.campaigns.currentCampaign.currentCampaignId
  );
  const { hasMultipleCharacters } = useCampaignType();

  const setLoadCompletedCharacterTracks = useStore(
    (store) => store.characters.currentCharacter.tracks.setLoadCompletedTracks
  );
  const setLoadCompletedCampaignTracks = useStore(
    (store) => store.campaigns.currentCampaign.tracks.setLoadCompletedTracks
  );

  const characterTrackMap = useStore(
    (store) => store.characters.currentCharacter.tracks.trackMap
  );
  const campaignTrackMap = useStore(
    (store) => store.campaigns.currentCampaign.tracks.trackMap
  );
  const campaignCharacterTracks = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterTracks
  );
  const campaignCharacters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );

  const addCharacterTrack = useStore(
    (store) => store.characters.currentCharacter.tracks.addTrack
  );
  const addCampaignTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.addTrack
  );
  const updateCharacterTrack = useStore(
    (store) => store.characters.currentCharacter.tracks.updateTrack
  );
  const updateCampaignTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateTrack
  );
  const updateCampaignCharacterTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.updateCharacterTrack
  );
  const deleteCharacterTrack = useStore(
    (store) => store.characters.currentCharacter.tracks.deleteTrack
  );
  const deleteCampaignTrack = useStore(
    (store) => store.campaigns.currentCampaign.tracks.deleteTrack
  );

  const [showCompletedTracks, setShowCompletedTracks] = useState(false);
  const [createTrackType, setCreateTrackType] = useState<TrackSectionTracks>();
  const [createSource, setCreateSource] = useState<CreateSource>("character");
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLButtonElement | null>(null);

  const availableTrackTypes = getAvailableTrackTypes({
    isDelveEnabled,
    isIronsworn,
    isLodestarEnabled,
    isStarforged,
  });

  const canChooseCreateSource = mode === "character" && isInCampaign;
  const defaultCreateSource: CreateSource =
    mode === "campaign" || (isInCampaign && hasMultipleCharacters)
      ? "campaign"
      : "character";
  const createScopeHelperText =
    createSource === "campaign"
      ? "Everyone in this campaign can see and use this track."
      : "Only this character can see and use this track.";

  const items = useMemo(() => {
    const nextItems: UnifiedTrackItem[] = [];

    if (mode === "character") {
      addTrackMapItems({
        items: nextItems,
        keyPrefix: "character",
        sourceLabel: "Character",
        trackMap: characterTrackMap[TrackStatus.Active] as TrackMapByType,
        updateTrack: updateCharacterTrack,
        deleteTrack: deleteCharacterTrack,
      });
      if (showCompletedTracks) {
        addTrackMapItems({
          items: nextItems,
          keyPrefix: "character-completed",
          sourceLabel: "Character",
          trackMap: characterTrackMap[TrackStatus.Completed] as TrackMapByType,
          updateTrack: updateCharacterTrack,
          deleteTrack: deleteCharacterTrack,
        });
      }
      if (isInCampaign) {
        addTrackMapItems({
          items: nextItems,
          keyPrefix: "campaign",
          sourceLabel: "Shared",
          trackMap: campaignTrackMap[TrackStatus.Active] as TrackMapByType,
          updateTrack: updateCampaignTrack,
          deleteTrack: deleteCampaignTrack,
        });
        if (showCompletedTracks) {
          addTrackMapItems({
            items: nextItems,
            keyPrefix: "campaign-completed",
            sourceLabel: "Shared",
            trackMap: campaignTrackMap[TrackStatus.Completed] as TrackMapByType,
            updateTrack: updateCampaignTrack,
            deleteTrack: deleteCampaignTrack,
          });
        }
      }
    } else {
      addTrackMapItems({
        items: nextItems,
        keyPrefix: "campaign",
        sourceLabel: "Shared",
        trackMap: campaignTrackMap[TrackStatus.Active] as TrackMapByType,
        updateTrack: updateCampaignTrack,
        deleteTrack: deleteCampaignTrack,
      });
      if (showCompletedTracks) {
        addTrackMapItems({
          items: nextItems,
          keyPrefix: "campaign-completed",
          sourceLabel: "Shared",
          trackMap: campaignTrackMap[TrackStatus.Completed] as TrackMapByType,
          updateTrack: updateCampaignTrack,
          deleteTrack: deleteCampaignTrack,
        });
      }
      Object.entries(campaignCharacterTracks).forEach(
        ([characterId, trackMap]) => {
          const characterName =
            campaignCharacters[characterId]?.name ?? "Character";
          allTrackTypes.forEach((trackType) => {
            Object.entries(trackMap[trackType] ?? {}).forEach(
              ([trackId, track]) => {
                if (
                  !showCompletedTracks &&
                  track.status === TrackStatus.Completed
                ) {
                  return;
                }
                nextItems.push({
                  key: `campaign-character-${characterId}-${trackId}`,
                  id: trackId,
                  track,
                  sourceLabel: characterName,
                  allowEdit: false,
                  allowDelete: false,
                  updateTrack: (id, trackUpdate) =>
                    updateCampaignCharacterTrack(characterId, id, trackUpdate),
                });
              }
            );
          });
        }
      );
    }

    return nextItems.sort(sortTrackItems);
  }, [
    campaignCharacterTracks,
    campaignCharacters,
    campaignTrackMap,
    characterTrackMap,
    deleteCampaignTrack,
    deleteCharacterTrack,
    isInCampaign,
    mode,
    showCompletedTracks,
    updateCampaignCharacterTrack,
    updateCampaignTrack,
    updateCharacterTrack,
  ]);

  const toggleShowCompletedTracks = (value: boolean) => {
    if (value) {
      if (mode === "character") {
        setLoadCompletedCharacterTracks();
      }
      if (mode === "campaign" || isInCampaign) {
        setLoadCompletedCampaignTracks();
      }
    }
    setShowCompletedTracks(value);
  };

  const openCreateDialog = (trackType: TrackSectionTracks) => {
    setCreateSource(defaultCreateSource);
    setCreateTrackType(trackType);
    setAddMenuOpen(false);
  };

  const closeCreateDialog = () => {
    setCreateTrackType(undefined);
  };

  const handleAddTrack = (track: Track) => {
    return createSource === "campaign"
      ? addCampaignTrack(track)
      : addCharacterTrack(track);
  };

  const isMobile = useIsMobile();

  return (
    <>
      <SectionHeading
        breakContainer={headingBreakContainer}
        label={"Tracks"}
        action={
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showCompletedTracks}
                  onChange={(_, checked) => toggleShowCompletedTracks(checked)}
                />
              }
              label={"Show Completed"}
            />
            <Button
              color={"inherit"}
              ref={addMenuRef}
              onClick={() => setAddMenuOpen(true)}
            >
              Add Track
            </Button>
          </>
        }
      />
      <Menu
        open={addMenuOpen}
        anchorEl={addMenuRef.current}
        onClose={() => setAddMenuOpen(false)}
      >
        {availableTrackTypes.map((trackType) => (
          <MenuItem key={trackType} onClick={() => openCreateDialog(trackType)}>
            <ListItemText primary={getTrackTypeLabel(trackType, isStarforged)} />
          </MenuItem>
        ))}
      </Menu>
      <Stack
        mt={2}
        spacing={4}
        mb={4}
        sx={(theme) => ({
          px: headingBreakContainer ? 0 : 2,
          [theme.breakpoints.up("md")]: {
            px: headingBreakContainer ? 0 : 3,
          },
          alignItems: isMobile ? "center" : undefined,
        })}
      >
        {items.length > 0 ? (
          items.map((item, index) => (
            <Box key={item.key} width={isMobile ? "fit-content" : "100%"}>
              {showCompletedTracks &&
                index > 0 &&
                item.track.status === TrackStatus.Completed &&
                items[index - 1].track.status !== TrackStatus.Completed && (
                  <Divider sx={{ mb: 4 }}>Completed Tracks</Divider>
                )}
              <UnifiedTrackListItem
                item={item}
                isStarforged={isStarforged}
                showSourceChip={mode === "campaign" || isInCampaign}
              />
            </Box>
          ))
        ) : (
          <EmptyState message={"No tracks found"} />
        )}
      </Stack>
      {createTrackType &&
        (createTrackType === TrackTypes.Clock ? (
          <ClockDialog
            open={!!createTrackType}
            handleClose={closeCreateDialog}
            shared={createSource === "campaign"}
            createScopeLabel={canChooseCreateSource ? "Shared" : undefined}
            createScopeChecked={
              canChooseCreateSource ? createSource === "campaign" : undefined
            }
            createScopeHelperText={
              canChooseCreateSource ? createScopeHelperText : undefined
            }
            onCreateScopeChange={(checked) =>
              setCreateSource(checked ? "campaign" : "character")
            }
            onClock={handleAddTrack}
          />
        ) : (
          <EditOrCreateTrackDialog
            open={!!createTrackType}
            handleClose={closeCreateDialog}
            trackType={createTrackType}
            trackTypeName={getTrackTypeLabel(createTrackType, isStarforged)}
            createScopeLabel={canChooseCreateSource ? "Shared" : undefined}
            createScopeChecked={
              canChooseCreateSource ? createSource === "campaign" : undefined
            }
            createScopeHelperText={
              canChooseCreateSource ? createScopeHelperText : undefined
            }
            onCreateScopeChange={(checked) =>
              setCreateSource(checked ? "campaign" : "character")
            }
            handleTrack={handleAddTrack}
          />
        ))}
    </>
  );
}

function UnifiedTrackListItem(props: {
  item: UnifiedTrackItem;
  isStarforged: boolean;
  showSourceChip: boolean;
}) {
  const { item, isStarforged, showSourceChip } = props;
  const { track } = item;

  const [editing, setEditing] = useState(false);
  const canUpdate = !!item.updateTrack;
  const isCompleted = track.status === TrackStatus.Completed;
  const canChangeActiveTrack = canUpdate && !isCompleted;
  const canEdit = canChangeActiveTrack && item.allowEdit;
  const canDelete = item.allowDelete && !!item.deleteTrack;

  const metadata = (
    <Stack direction={"row"} spacing={1} mb={1} flexWrap={"wrap"} useFlexGap>
      {showSourceChip && <Chip size={"small"} label={item.sourceLabel} />}
      <Chip size={"small"} label={getTrackTypeLabel(track.type, isStarforged)} />
    </Stack>
  );

  if (track.type === TrackTypes.Clock) {
    return (
      <>
        {metadata}
        <Clock
          clock={track}
          onEdit={canEdit ? () => setEditing(true) : undefined}
          onSelectedOracleChange={
            canChangeActiveTrack
              ? (oracleKey) =>
                  item.updateTrack?.(item.id, { oracleKey }).catch(() => {})
              : undefined
          }
          onComplete={
            canChangeActiveTrack
              ? () =>
                  item
                    .updateTrack?.(item.id, { status: TrackStatus.Completed })
                    .catch(() => {})
              : undefined
          }
          onValueChange={
            canChangeActiveTrack
              ? (value) => item.updateTrack?.(item.id, { value }).catch(() => {})
              : undefined
          }
          handleDelete={
            canDelete
              ? () => item.deleteTrack?.(item.id).catch(() => {})
              : undefined
          }
        />
        {editing && (
          <ClockDialog
            initialClock={track}
            open={editing}
            handleClose={() => setEditing(false)}
            onClock={(updatedTrack) =>
              item.updateTrack?.(item.id, updatedTrack) ?? Promise.resolve()
            }
          />
        )}
      </>
    );
  }

  if (track.type === TrackTypes.SceneChallenge) {
    return (
      <>
        {metadata}
        <ProgressTrack
          status={track.status}
          trackType={TrackTypes.SceneChallenge}
          label={track.label}
          description={track.description}
          difficulty={track.difficulty}
          value={track.value}
          max={40}
          onValueChange={
            canChangeActiveTrack
              ? (value) => item.updateTrack?.(item.id, { value }).catch(() => {})
              : undefined
          }
          onComplete={
            canChangeActiveTrack
              ? () =>
                  item
                    .updateTrack?.(item.id, { status: TrackStatus.Completed })
                    .catch(() => {})
              : undefined
          }
          onReopen={
            canUpdate && isCompleted
              ? () =>
                  item
                    .updateTrack?.(item.id, { status: TrackStatus.Active })
                    .catch(() => {})
              : undefined
          }
          onEdit={canEdit ? () => setEditing(true) : undefined}
          onDelete={
            canDelete
              ? () => item.deleteTrack?.(item.id).catch(() => {})
              : undefined
          }
          hideRollButton={!canChangeActiveTrack}
          sceneChallenge={{
            filledSegments: track.segmentsFilled,
            onChange: canChangeActiveTrack
              ? (segmentsFilled: number) =>
                  item.updateTrack?.(item.id, { segmentsFilled }).catch(() => {})
              : undefined,
          }}
        />
        {editing && (
          <EditOrCreateTrackDialog
            open={editing}
            handleClose={() => setEditing(false)}
            trackType={TrackTypes.SceneChallenge}
            trackTypeName={getTrackTypeLabel(track.type, isStarforged)}
            initialTrack={track}
            onDelete={
              canDelete
                ? () => item.deleteTrack?.(item.id) ?? Promise.resolve()
                : undefined
            }
            handleTrack={(updatedTrack) =>
              item.updateTrack?.(item.id, updatedTrack) ?? Promise.resolve()
            }
          />
        )}
      </>
    );
  }

  return (
    <>
      {metadata}
      <ProgressTrack
        status={track.status}
        trackType={track.type as TrackSectionProgressTracks}
        label={track.label}
        description={track.description}
        difficulty={track.difficulty}
        value={track.value}
        max={40}
        onValueChange={
          canChangeActiveTrack
            ? (value) => item.updateTrack?.(item.id, { value }).catch(() => {})
            : undefined
        }
        onComplete={
          canChangeActiveTrack
            ? () =>
                item
                  .updateTrack?.(item.id, { status: TrackStatus.Completed })
                  .catch(() => {})
            : undefined
        }
        onReopen={
          canUpdate && isCompleted
            ? () =>
                item
                  .updateTrack?.(item.id, { status: TrackStatus.Active })
                  .catch(() => {})
            : undefined
        }
        onEdit={canEdit ? () => setEditing(true) : undefined}
        onDelete={
          canDelete
            ? () => item.deleteTrack?.(item.id).catch(() => {})
            : undefined
        }
        hideRollButton={!canChangeActiveTrack}
      />
      {editing && (
        <EditOrCreateTrackDialog
          open={editing}
          handleClose={() => setEditing(false)}
          trackType={track.type as TrackSectionProgressTracks}
          trackTypeName={getTrackTypeLabel(track.type, isStarforged)}
          initialTrack={track as IProgressTrack | SceneChallenge}
          onDelete={
            canDelete
              ? () => item.deleteTrack?.(item.id) ?? Promise.resolve()
              : undefined
          }
          handleTrack={(updatedTrack) =>
            item.updateTrack?.(item.id, updatedTrack) ?? Promise.resolve()
          }
        />
      )}
    </>
  );
}

function addTrackMapItems(params: {
  items: UnifiedTrackItem[];
  keyPrefix: string;
  sourceLabel: string;
  trackMap: TrackMapByType;
  updateTrack: (trackId: string, track: Partial<Track>) => Promise<void>;
  deleteTrack: (trackId: string) => Promise<void>;
}) {
  const {
    items,
    keyPrefix,
    sourceLabel,
    trackMap,
    updateTrack,
    deleteTrack,
  } = params;

  allTrackTypes.forEach((trackType) => {
    Object.entries(trackMap[trackType] ?? {}).forEach(([trackId, track]) => {
      items.push({
        key: `${keyPrefix}-${trackId}`,
        id: trackId,
        track,
        sourceLabel,
        allowEdit: true,
        allowDelete: true,
        updateTrack,
        deleteTrack,
      });
    });
  });
}

function sortTrackItems(a: UnifiedTrackItem, b: UnifiedTrackItem): number {
  if (a.track.status !== b.track.status) {
    return a.track.status === TrackStatus.Active ? -1 : 1;
  }
  return getCreatedTime(b.track) - getCreatedTime(a.track);
}

function getCreatedTime(track: Track): number {
  return track.createdDate instanceof Date ? track.createdDate.getTime() : 0;
}
