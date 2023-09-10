import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ChevronLeft";
import { NPCDocument, NPC_SPECIES } from "types/NPCs.type";
import { DebouncedOracleInput } from "components/DebouncedOracleInput";
import { useLayoutEffect, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { ImageUploader } from "components/ImageUploader/ImageUploader";
import { SectionHeading } from "components/SectionHeading";
import { RtcRichTextEditor } from "components/RichTextEditor/RtcRichTextEditor";
import { NPCDocumentWithGMProperties } from "stores/world/currentWorld/npcs/npcs.slice.type";
import { LocationDocumentWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { useListenToCurrentNPC } from "stores/world/currentWorld/npcs/useListenToCurrentNPC";
import { useStore } from "stores/store";
import { BondsSection } from "components/BondsSection";

export interface OpenNPCProps {
  isWorldOwner: boolean;
  worldId: string;
  npcId: string;
  locations: { [key: string]: LocationDocumentWithGMProperties };
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
    canUseImages,
  } = props;
  const confirm = useConfirm();

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
  const isCharacterBondedToLocation =
    npcLocationBonds[currentCharacterId ?? ""] ?? false;
  const isCharacterBondedToNPC = npcBonds[currentCharacterId ?? ""] ?? false;

  const singleplayerBond =
    isCharacterBondedToLocation || isCharacterBondedToNPC || false;

  const updateNPCCharacterBond = useStore(
    (store) => store.worlds.currentWorld.currentWorldNPCs.updateNPCCharacterBond
  );

  const currentCampaignCharacters = useStore(
    (store) => store.campaigns.currentCampaign.characters.characterMap
  );
  const bondedCharacterNames = Object.keys(currentCampaignCharacters)
    .filter(
      (characterId) => npcLocationBonds[characterId] || npcBonds[characterId]
    )
    .map((characterId) => currentCampaignCharacters[characterId]?.name ?? "");

  return (
    <Box
      overflow={"auto"}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
      })}
    >
      {canUseImages && (
        <ImageUploader
          src={npc.imageUrl}
          title={npc.name}
          handleClose={() => closeNPC()}
          handleFileUpload={(image) =>
            uploadNPCImage(npcId, image).catch(() => {})
          }
        />
      )}
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={(theme) => ({
          px: 2,
          py: 1,
        })}
      >
        <IconButton onClick={() => closeNPC()}>
          <BackIcon />
        </IconButton>
        <DebouncedOracleInput
          placeholder={"NPC Name"}
          variant={"standard"}
          color={"secondary"}
          oracleTableId={nameOracles[npc.species]}
          inputRef={nameInputRef}
          initialValue={npc.name}
          updateValue={(newName) => handleUpdateNPC({ name: newName })}
        />
        <IconButton onClick={() => handleNPCDelete()}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Box
        sx={(theme) => ({
          mt: 1,
          px: 2,
          [theme.breakpoints.up("md")]: { px: 3 },
        })}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
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
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={Object.keys(locations)}
              getOptionLabel={(locationId) => locations[locationId]?.name ?? ""}
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
              <Grid item xs={12} sm={6}>
                <DebouncedOracleInput
                  label={"Descriptor"}
                  initialValue={npc?.gmProperties?.descriptor ?? ""}
                  updateValue={(descriptor) =>
                    updateNPCGMProperties(npcId, { descriptor }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/character/descriptor"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DebouncedOracleInput
                  label={"Role"}
                  initialValue={npc?.gmProperties?.role ?? ""}
                  updateValue={(role) =>
                    updateNPCGMProperties(npcId, { role }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/character/role"
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
                  oracleTableId="ironsworn/oracles/character/disposition"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DebouncedOracleInput
                  label={"Activity"}
                  initialValue={npc?.gmProperties?.activity ?? ""}
                  updateValue={(activity) =>
                    updateNPCGMProperties(npcId, { activity }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/character/activity"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DebouncedOracleInput
                  label={"Goal"}
                  initialValue={npc?.gmProperties?.goal ?? ""}
                  updateValue={(goal) =>
                    updateNPCGMProperties(npcId, { goal }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/character/goal"
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
                          updateNPC(npcId, { sharedWithPlayers: value }).catch(
                            () => {}
                          )
                        }
                      />
                    }
                    label="Visible to Players"
                  />
                </Grid>
              )}
              {isSinglePlayer && (
                <BondsSection
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
                  bondedCharacters={bondedCharacterNames}
                  disableToggle={isCharacterBondedToLocation}
                  inheritedBondName={
                    isCharacterBondedToLocation ? npcLocation?.name : undefined
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
                      players in campaigns. Notes for singleplayer games should
                      go in the above section.
                    </Alert>
                  </Grid>
                </>
              )}
              {!isSinglePlayer && (
                <BondsSection
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
                  bondedCharacters={bondedCharacterNames}
                  disableToggle={isCharacterBondedToLocation}
                  inheritedBondName={
                    isCharacterBondedToLocation ? npcLocation?.name : undefined
                  }
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
  );
}
