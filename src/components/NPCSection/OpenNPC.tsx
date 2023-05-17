import {
  Autocomplete,
  Box,
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

const isConstrained = false;
const hasMaxHeight = true;

export interface OpenNPCProps {
  worldOwnerId: string;
  worldId: string;
  npcId: string;
  locations: { [key: string]: LocationDocumentWithGMProperties };
  npc: NPC;
  closeNPC: () => void;
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
  const { worldOwnerId, worldId, npcId, locations, npc, closeNPC } = props;

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
    <Box>
      <Box
        sx={{
          aspectRatio: !isConstrained && hasMaxHeight ? undefined : "16/9",
          maxWidth: "100%",
          height: !isConstrained && hasMaxHeight ? 300 : "100%",
          width: "100%",
          overflow: "hidden",
          backgroundImage: 'url("/assets/test/Fionae.png")',
          backgroundSize: "",
          backgroundPosition: "center center",
        }}
      />
      <Box
        display={"flex"}
        alignItems={"center"}
        sx={(theme) => ({
          px: 2,
          py: 1,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: theme.palette.divider,
          borderStyle: "solid",
          backgroundColor: theme.palette.background.paper,
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
      <Grid container spacing={2} sx={{ p: 2, mt: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
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
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            options={Object.keys(locations)}
            getOptionLabel={(locationId) => locations[locationId]?.name ?? ""}
            autoHighlight
            defaultValue={npc.lastLocationId ?? ""}
            onChange={(evt, value) =>
              handleUpdateNPC({ lastLocationId: value ?? "" })
            }
            renderInput={(props) => (
              <TextField {...props} label={"Location"} fullWidth />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
