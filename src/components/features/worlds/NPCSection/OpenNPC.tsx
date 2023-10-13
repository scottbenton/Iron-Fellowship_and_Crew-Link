import {
  Alert,
  Autocomplete,
  Box,
  ButtonBase,
  Checkbox,
  FormControlLabel,
  Grid,
  Hidden,
  IconButton,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ChevronLeft";
import { NPCDocument, NPC_SPECIES } from "types/NPCs.type";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { ChangeEvent, useLayoutEffect, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { ImageUploader } from "components/features/worlds/ImageUploader";
import { SectionHeading } from "components/shared/SectionHeading";
import { RtcRichTextEditor } from "components/shared/RichTextEditor/RtcRichTextEditor";
import { NPCDocumentWithGMProperties } from "stores/world/currentWorld/npcs/npcs.slice.type";
import { LocationDocumentWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { useListenToCurrentNPC } from "stores/world/currentWorld/npcs/useListenToCurrentNPC";
import { useStore } from "stores/store";
import { BondsSection } from "components/features/worlds/BondsSection";
import { ItemHeader } from "../ItemHeader";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { RoundedImageUploader } from "./RoundedImageUploader";
import { useWorldPermissions } from "../useWorldPermissions";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { Sector } from "types/Sector.type";
import { DIFFICULTY } from "types/Track.type";

export interface OpenNPCProps {
  isWorldOwner: boolean;
  worldId: string;
  npcId: string;
  locations: { [key: string]: LocationDocumentWithGMProperties };
  sectors: Record<string, Sector>;
  npc: NPCDocumentWithGMProperties;
  closeNPC: () => void;
  isWorldOwnerPremium?: boolean;
  isSinglePlayer?: boolean;
  canUseImages: boolean;
}

const nameOracles: { [key in NPC_SPECIES]: string | string[] } = {
  [NPC_SPECIES.IRONLANDER]: [
    "ironsworn/oracles/name/ironlander/a",
    "ironsworn/oracles/name/ironlander/b",
  ],
  [NPC_SPECIES.ELF]: "ironsworn/oracles/name/elf",
  [NPC_SPECIES.GIANT]: "ironsworn/oracles/name/other/giant",
  [NPC_SPECIES.VAROU]: "ironsworn/oracles/name/other/varou",
  [NPC_SPECIES.TROLL]: "ironsworn/oracles/name/other/troll",
  [NPC_SPECIES.OTHER]: [
    "ironsworn/oracles/name/ironlander/a",
    "ironsworn/oracles/name/ironlander/b",
  ],
};

export function OpenNPC(props: OpenNPCProps) {
  const {
    isWorldOwner,
    worldId,
    npcId,
    locations,
    npc,
    closeNPC,
    isSinglePlayer,
    sectors,
    canUseImages,
  } = props;
  const confirm = useConfirm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showGMFields, showGMTips, isSingleplayer } = useWorldPermissions();

  useListenToCurrentNPC(npcId);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const initialLoadRef = useRef<boolean>(true);

  useLayoutEffect(() => {
    if (initialLoadRef.current && nameInputRef.current) {
      if (npc.name === "New NPC") {
        nameInputRef.current.select();
      }
      initialLoadRef.current = false;
    }
  }, [npc]);

  const updateNPC = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.updateNPC
  );
  const deleteNPC = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.deleteNPC
  );
  const uploadNPCImage = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.uploadNPCImage
  );
  const updateNPCGMProperties = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.updateNPCGMProperties
  );

  const updateNPCGMNotes = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.updateNPCGMNotes
  );
  const updateNPCNotes = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.updateNPCNotes
  );

  const handleUpdateNPC = (doc: Partial<NPCDocument>) => {
    updateNPC(npcId, doc).catch(() => {});
  };

  const handleNPCDelete = () => {
    confirm({
      title: `Delete ${npc.name}`,
      description:
        "Are you sure you want to delete this NPC? It will be deleted from ALL of your characters and campaigns that use this world. This cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteNPC(npcId)
          .catch(() => {})
          .then(() => {
            closeNPC();
          });
      })
      .catch(() => {});
  };

  const currentCharacterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const npcLocation = npc.lastLocationId
    ? locations[npc.lastLocationId]
    : undefined;
  const npcLocationBonds = npcLocation?.characterBonds ?? {};
  const npcBonds = npc.characterBonds ?? {};
  const npcConnections = npc.characterConnections ?? {};
  const isCharacterBondedToLocation =
    npcLocationBonds[currentCharacterId ?? ""] ?? false;
  const isCharacterBondedToNPC = npcBonds[currentCharacterId ?? ""] ?? false;

  const singleplayerBond =
    isCharacterBondedToLocation || isCharacterBondedToNPC || false;

  const updateNPCCharacterBond = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.updateNPCCharacterBond
  );
  const updateNPCCharacterBondValue = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldNPCs.updateNPCCharacterBondValue
  );
  const updateNPCCharacterConnection = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldNPCs.updateNPCCharacterConnection
  );

  const currentCampaignCharacters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );
  const bondedCharacterNames = Object.keys(currentCampaignCharacters)
    .filter(
      (characterId) => npcLocationBonds[characterId] || npcBonds[characterId]
    )
    .map((characterId) => currentCampaignCharacters[characterId]?.name ?? "");

  const connectedCharacterNames = Object.keys(currentCampaignCharacters)
    .filter((characterId) => npcConnections[characterId])
    .map((characterId) => currentCampaignCharacters[characterId]?.name ?? "");

  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const isStarforged = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: false,
    [GAME_SYSTEMS.STARFORGED]: true,
  });

  const npcNameOracles = useGameSystemValue<string | string[]>({
    [GAME_SYSTEMS.IRONSWORN]:
      nameOracles[npc.species ?? NPC_SPECIES.IRONLANDER],
    [GAME_SYSTEMS.STARFORGED]: [
      "starforged/oracles/characters/names/given",
      "starforged/oracles/characters/names/family_name",
    ],
  });
  const npcRoleOracle = useGameSystemValue<string>({
    [GAME_SYSTEMS.IRONSWORN]: "ironsworn/oracles/character/role",
    [GAME_SYSTEMS.STARFORGED]: "starforged/oracles/characters/role",
  });
  const npcDispositionOracle = useGameSystemValue<string>({
    [GAME_SYSTEMS.IRONSWORN]: "ironsworn/oracles/character/disposition",
    [GAME_SYSTEMS.STARFORGED]:
      "starforged/oracles/characters/initial_disposition",
  });
  const npcGoalOracle = useGameSystemValue<string>({
    [GAME_SYSTEMS.IRONSWORN]: "ironsworn/oracles/character/goal",
    [GAME_SYSTEMS.STARFORGED]: "starforged/oracles/characters/goal",
  });

  return (
    <Box overflow={"auto"}>
      {canUseImages && (
        <Box
          sx={(theme) => ({
            height: theme.spacing(isLg ? 10 : 6),
          })}
        >
          <Box
            sx={(theme) => ({
              borderRadius: "100%",
              position: "relative",
              border: `1px solid ${theme.palette.divider}`,
              top: theme.spacing(2),
              left: theme.spacing(2),

              [theme.breakpoints.up("md")]: { left: theme.spacing(3) },

              width: isLg ? 152 : 102,
              height: isLg ? 152 : 102,
              flexShrink: "0",
              zIndex: 0,
            })}
          />
        </Box>
      )}
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.background.paper,
          borderTop: canUseImages
            ? `1px solid ${theme.palette.divider}`
            : undefined,
          borderLeft: `1px solid ${theme.palette.divider}`,
          zIndex: 1,
          position: "relative",
        })}
      >
        <Box
          display={"flex"}
          alignItems={"flex-start"}
          px={2}
          sx={{
            [theme.breakpoints.up("md")]: { px: 3 },
          }}
          mb={canUseImages ? (isLg ? -8 : -4) : 0}
        >
          {canUseImages && (
            <RoundedImageUploader
              src={npc.imageUrl}
              title={npc.name}
              handleFileUpload={(file) =>
                uploadNPCImage(npcId, file).catch(() => {})
              }
              handleUploadClick={() => fileInputRef.current?.click()}
              ref={fileInputRef}
            />
          )}
          <Box
            justifyContent={isLg ? "space-between" : "flex-end"}
            flexGrow={1}
            display={"flex"}
            alignItems={"flex-start"}
            py={1}
            pl={canUseImages ? 2 : 0}
          >
            <Hidden lgDown>
              <DebouncedOracleInput
                label={"Name"}
                variant={"outlined"}
                color={"primary"}
                oracleTableId={npcNameOracles}
                joinOracleTables={isStarforged}
                inputRef={nameInputRef}
                initialValue={npc.name}
                updateValue={(newName) => handleUpdateNPC({ name: newName })}
                sx={{ mt: 2, maxWidth: 300 }}
              />
            </Hidden>
            <Box mt={1}>
              {canUseImages && (
                <IconButton onClick={() => fileInputRef.current?.click()}>
                  <AddPhotoIcon />
                </IconButton>
              )}
              {showGMFields && (
                <IconButton onClick={() => handleNPCDelete()}>
                  <DeleteIcon />
                </IconButton>
              )}
              <IconButton onClick={() => closeNPC()}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={(theme) => ({
            mt: 1,
            px: 2,
            [theme.breakpoints.up("md")]: { px: 3 },
            pb: 1,
          })}
        >
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Hidden lgUp>
              <Grid item xs={12}>
                <DebouncedOracleInput
                  label={"Name"}
                  variant={"outlined"}
                  color={"primary"}
                  oracleTableId={npcNameOracles}
                  joinOracleTables={isStarforged}
                  inputRef={nameInputRef}
                  initialValue={npc.name}
                  updateValue={(newName) => handleUpdateNPC({ name: newName })}
                />
              </Grid>
            </Hidden>
            <Grid item xs={12} sm={6}>
              <DebouncedOracleInput
                oracleTableId={undefined}
                label={"Pronouns"}
                initialValue={npc.pronouns ?? ""}
                updateValue={(value) => handleUpdateNPC({ pronouns: value })}
              />
            </Grid>
            {isStarforged && (
              <Grid item xs={12} sm={6}>
                <DebouncedOracleInput
                  oracleTableId={"starforged/oracles/characters/names/callsign"}
                  label={"Callsign"}
                  initialValue={npc.callsign ?? ""}
                  updateValue={(value) => handleUpdateNPC({ callsign: value })}
                />
              </Grid>
            )}
            {isStarforged && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label={"Difficulty"}
                  value={npc.rank ?? "-1"}
                  onChange={(evt) =>
                    handleUpdateNPC({ rank: evt.target.value as DIFFICULTY })
                  }
                  multiline
                  required
                  select
                  fullWidth
                >
                  <MenuItem value={"-1"} disabled></MenuItem>

                  <MenuItem value={DIFFICULTY.TROUBLESOME}>
                    Troublesome
                  </MenuItem>
                  <MenuItem value={DIFFICULTY.DANGEROUS}>Dangerous</MenuItem>
                  <MenuItem value={DIFFICULTY.FORMIDABLE}>Formidable</MenuItem>
                  <MenuItem value={DIFFICULTY.EXTREME}>Extreme</MenuItem>
                  <MenuItem value={DIFFICULTY.EPIC}>Epic</MenuItem>
                </TextField>
              </Grid>
            )}
            {!isStarforged && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label={"Species"}
                  value={npc.species}
                  onChange={(evt) =>
                    handleUpdateNPC({
                      species: (evt.target.value ??
                        NPC_SPECIES.IRONLANDER) as NPC_SPECIES,
                    })
                  }
                  fullWidth
                >
                  <MenuItem value={NPC_SPECIES.IRONLANDER}>Ironlander</MenuItem>
                  <MenuItem value={NPC_SPECIES.ELF}>Elf</MenuItem>
                  <MenuItem value={NPC_SPECIES.GIANT}>Giant</MenuItem>
                  <MenuItem value={NPC_SPECIES.VAROU}>Varou</MenuItem>
                  <MenuItem value={NPC_SPECIES.TROLL}>Troll</MenuItem>
                  <MenuItem value={NPC_SPECIES.OTHER}>Other</MenuItem>
                </TextField>
              </Grid>
            )}
            {!isStarforged && (
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={Object.keys(locations)}
                  getOptionLabel={(locationId) =>
                    locations[locationId]?.name ?? ""
                  }
                  autoHighlight
                  value={npc.lastLocationId ?? null}
                  onChange={(evt, value) =>
                    handleUpdateNPC({ lastLocationId: value ?? "" })
                  }
                  renderInput={(props) => (
                    <TextField {...props} label={"Location"} fullWidth />
                  )}
                />
              </Grid>
            )}
            {isStarforged && (
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={Object.keys(sectors)}
                  getOptionLabel={(sectorId) => sectors[sectorId]?.name ?? ""}
                  autoHighlight
                  value={npc.lastSectorId ?? null}
                  onChange={(evt, value) =>
                    handleUpdateNPC({ lastSectorId: value ?? "" })
                  }
                  renderInput={(props) => (
                    <TextField {...props} label={"Sector"} fullWidth />
                  )}
                />
              </Grid>
            )}
            {isWorldOwner && (
              <>
                {!isSinglePlayer && (
                  <>
                    <Grid item xs={12}>
                      <SectionHeading label={"GM Only"} breakContainer />
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity={"info"}>
                        Information in this section will not be shared with your
                        players.
                      </Alert>
                    </Grid>
                  </>
                )}
                {!isStarforged && (
                  <Grid item xs={12} sm={6}>
                    <DebouncedOracleInput
                      label={"Descriptor"}
                      initialValue={npc?.gmProperties?.descriptor ?? ""}
                      updateValue={(descriptor) =>
                        updateNPCGMProperties(npcId, { descriptor }).catch(
                          () => {}
                        )
                      }
                      oracleTableId="ironsworn/oracles/character/descriptor"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <DebouncedOracleInput
                    label={"Role"}
                    initialValue={npc?.gmProperties?.role ?? ""}
                    updateValue={(role) =>
                      updateNPCGMProperties(npcId, { role }).catch(() => {})
                    }
                    oracleTableId={npcRoleOracle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DebouncedOracleInput
                    label={"Disposition"}
                    initialValue={npc?.gmProperties?.disposition ?? ""}
                    updateValue={(disposition) =>
                      updateNPCGMProperties(npcId, { disposition }).catch(
                        () => {}
                      )
                    }
                    oracleTableId={npcDispositionOracle}
                  />
                </Grid>
                {!isStarforged && (
                  <Grid item xs={12} sm={6}>
                    <DebouncedOracleInput
                      label={"Activity"}
                      initialValue={npc?.gmProperties?.activity ?? ""}
                      updateValue={(activity) =>
                        updateNPCGMProperties(npcId, { activity }).catch(
                          () => {}
                        )
                      }
                      oracleTableId="ironsworn/oracles/character/activity"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <DebouncedOracleInput
                    label={"Goal"}
                    initialValue={npc?.gmProperties?.goal ?? ""}
                    updateValue={(goal) =>
                      updateNPCGMProperties(npcId, { goal }).catch(() => {})
                    }
                    oracleTableId={npcGoalOracle}
                  />
                </Grid>
                {!isSinglePlayer && (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ alignItems: "center", display: "flex" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={npc.sharedWithPlayers ?? false}
                          onChange={(evt, value) =>
                            updateNPC(npcId, {
                              sharedWithPlayers: value,
                            }).catch(() => {})
                          }
                        />
                      }
                      label="Visible to Players"
                    />
                  </Grid>
                )}
                {isSinglePlayer && (
                  <BondsSection
                    isStarforged={isStarforged}
                    onBondToggle={
                      currentCharacterId
                        ? (bonded) =>
                            updateNPCCharacterBond(
                              npcId,
                              currentCharacterId,
                              bonded
                            ).catch(() => {})
                        : undefined
                    }
                    isBonded={singleplayerBond}
                    bondProgress={
                      npc.characterBondProgress?.[currentCharacterId ?? ""] ?? 0
                    }
                    difficulty={npc.rank}
                    updateBondProgressValue={
                      currentCharacterId
                        ? (value) =>
                            updateNPCCharacterBondValue(
                              npcId,
                              currentCharacterId,
                              value
                            )
                        : undefined
                    }
                    hasConnection={
                      npc.characterConnections?.[currentCharacterId ?? ""] ??
                      false
                    }
                    onConnectionToggle={
                      currentCharacterId
                        ? (connected) =>
                            updateNPCCharacterConnection(
                              npcId,
                              currentCharacterId,
                              connected
                            ).catch(() => {})
                        : undefined
                    }
                    bondedCharacters={bondedCharacterNames}
                    disableToggle={isCharacterBondedToLocation}
                    inheritedBondName={
                      isCharacterBondedToLocation
                        ? npcLocation?.name
                        : undefined
                    }
                  />
                )}
                <Grid item xs={12}>
                  <RtcRichTextEditor
                    id={npcId}
                    roomPrefix={`iron-fellowship-${worldId}-npc-gmnotes-`}
                    documentPassword={worldId}
                    onSave={updateNPCGMNotes}
                    initialValue={npc.gmProperties?.gmNotes}
                  />
                </Grid>
              </>
            )}
            {!isSinglePlayer && (
              <>
                {isWorldOwner && (
                  <>
                    <Grid item xs={12}>
                      <SectionHeading
                        label={"GM & Player Notes"}
                        breakContainer
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Alert severity={"info"}>
                        Notes in this section will only be visible to gms &
                        players in campaigns. Notes for singleplayer games
                        should go in the above section.
                      </Alert>
                    </Grid>
                  </>
                )}
                {!isSinglePlayer && (
                  <BondsSection
                    isStarforged={isStarforged}
                    onBondToggle={
                      currentCharacterId
                        ? (bonded) =>
                            updateNPCCharacterBond(
                              npcId,
                              currentCharacterId,
                              bonded
                            ).catch(() => {})
                        : undefined
                    }
                    isBonded={singleplayerBond}
                    hasConnection={
                      npc.characterConnections?.[currentCharacterId ?? ""] ??
                      false
                    }
                    bondProgress={
                      npc.characterBondProgress?.[currentCharacterId ?? ""] ?? 0
                    }
                    difficulty={npc.rank}
                    updateBondProgressValue={
                      currentCharacterId
                        ? (value) =>
                            updateNPCCharacterBondValue(
                              npcId,
                              currentCharacterId,
                              value
                            )
                        : undefined
                    }
                    onConnectionToggle={
                      currentCharacterId
                        ? (connected) =>
                            updateNPCCharacterConnection(
                              npcId,
                              currentCharacterId,
                              connected
                            ).catch(() => {})
                        : undefined
                    }
                    bondedCharacters={bondedCharacterNames}
                    disableToggle={isCharacterBondedToLocation}
                    inheritedBondName={
                      isCharacterBondedToLocation
                        ? npcLocation?.name
                        : undefined
                    }
                    connectedCharacters={connectedCharacterNames}
                  />
                )}
                {!npc.sharedWithPlayers && (
                  <Grid item xs={12}>
                    <Alert severity="warning">
                      These notes are not yet visible to players because this
                      location is hidden from them.
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  {(npc.notes || npc.notes === null) && (
                    <RtcRichTextEditor
                      id={npcId}
                      roomPrefix={`iron-fellowship-${worldId}-npc-`}
                      documentPassword={worldId}
                      onSave={updateNPCNotes}
                      initialValue={npc.notes || undefined}
                    />
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
