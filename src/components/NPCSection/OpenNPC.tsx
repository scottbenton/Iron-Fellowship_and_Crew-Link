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
import {
  LocationDocumentWithGMProperties,
  NPC,
} from "stores/sharedLocationStore";
import BackIcon from "@mui/icons-material/ChevronLeft";
import { NPCDocument, NPC_SPECIES } from "types/NPCs.type";
import { DebouncedOracleInput } from "components/DebouncedOracleInput";
import { useLayoutEffect, useRef } from "react";
import { useUpdateNPC } from "api/worlds/npcs/updateNPC";
import { useDeleteNPC } from "api/worlds/npcs/deleteNPC";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { ImageUploader } from "components/ImageUploader/ImageUploader";
import { useUploadNPCImage } from "api/worlds/npcs/uploadNPCImage";
import { SectionHeading } from "components/SectionHeading";
import { useAuth } from "providers/AuthProvider";
import { RtcRichTextEditor } from "components/RichTextEditor/RtcRichTextEditor";
import { useUpdateNPCNotes } from "api/worlds/npcs/updateNPCNotes";
import { TextFieldWithOracle } from "components/TextFieldWithOracle/TextFieldWithOracle";
import { useUpdateNPCGMProperties } from "api/worlds/npcs/updateNPCGMProperties";
import { useUpdateNPCGMNotes } from "api/worlds/npcs/updateNPCGMNotes";
import { RichTextEditorNoTitle } from "components/RichTextEditor";

const isConstrained = false;
const hasMaxHeight = true;

export interface OpenNPCProps {
  worldOwnerId: string;
  worldId: string;
  npcId: string;
  locations: { [key: string]: LocationDocumentWithGMProperties };
  npc: NPC;
  closeNPC: () => void;
  isWorldOwnerPremium?: boolean;
  isSinglePlayer?: boolean;
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
    worldOwnerId,
    worldId,
    npcId,
    locations,
    npc,
    closeNPC,
    isSinglePlayer,
  } = props;
  const uid = useAuth().user?.uid;

  const isWorldOwner = worldOwnerId === uid;

  const confirm = useConfirm();

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

  const { updateNPC } = useUpdateNPC();
  const { deleteNPC } = useDeleteNPC();
  const { uploadNPCImage } = useUploadNPCImage();
  const { updateNPCGMProperties } = useUpdateNPCGMProperties();
  const { updateNPCGMNotes } = useUpdateNPCGMNotes();
  const { updateNPCNotes } = useUpdateNPCNotes();

  const handleUpdateNPC = (doc: Partial<NPCDocument>) => {
    updateNPC({
      worldId,
      npcId,
      npc: doc,
    }).catch(() => {});
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
        deleteNPC({ worldId, npcId })
          .catch(() => {})
          .then(() => {
            closeNPC();
          });
      })
      .catch(() => {});
  };

  return (
    <Box
      overflow={"auto"}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
      })}
    >
      <ImageUploader
        src={npc.imageUrls?.[0]}
        title={npc.name}
        handleClose={() => closeNPC()}
        handleFileUpload={(image) =>
          uploadNPCImage({
            worldId,
            npcId,
            image,
          }).catch(() => {})
        }
      />
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
                    updateNPCGMProperties({
                      worldId,
                      npcId,
                      npcGMProperties: { descriptor },
                    }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/character/descriptor"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DebouncedOracleInput
                  label={"Role"}
                  initialValue={npc?.gmProperties?.role ?? ""}
                  updateValue={(role) =>
                    updateNPCGMProperties({
                      worldId,
                      npcId,
                      npcGMProperties: { role },
                    }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/character/role"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DebouncedOracleInput
                  label={"Disposition"}
                  initialValue={npc?.gmProperties?.disposition ?? ""}
                  updateValue={(disposition) =>
                    updateNPCGMProperties({
                      worldId,
                      npcId,
                      npcGMProperties: { disposition },
                    }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/character/disposition"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DebouncedOracleInput
                  label={"Activity"}
                  initialValue={npc?.gmProperties?.activity ?? ""}
                  updateValue={(activity) =>
                    updateNPCGMProperties({
                      worldId,
                      npcId,
                      npcGMProperties: { activity },
                    }).catch(() => {})
                  }
                  oracleTableId="ironsworn/oracles/character/activity"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DebouncedOracleInput
                  label={"Goal"}
                  initialValue={npc?.gmProperties?.goal ?? ""}
                  updateValue={(goal) =>
                    updateNPCGMProperties({
                      worldId,
                      npcId,
                      npcGMProperties: { goal },
                    }).catch(() => {})
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
                          updateNPC({
                            worldId,
                            npcId,
                            npc: { sharedWithPlayers: value },
                          }).catch(() => {})
                        }
                      />
                    }
                    label="Visible to Players"
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <RichTextEditorNoTitle
                  id={npcId}
                  content={npc.gmProperties?.notes ?? ""}
                  onSave={({ content, isBeaconRequest }) =>
                    updateNPCGMNotes({
                      worldId,
                      npcId,
                      notes: content,
                      isBeacon: isBeaconRequest,
                    })
                  }
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
                    roomPrefix={`iron-fellowship-${worldOwnerId}-`}
                    documentPassword={worldId}
                    onSave={(documentId, notes, isBeaconRequest) =>
                      updateNPCNotes({
                        worldId,
                        npcId: documentId,
                        notes,
                        isBeacon: isBeaconRequest,
                      })
                    }
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
