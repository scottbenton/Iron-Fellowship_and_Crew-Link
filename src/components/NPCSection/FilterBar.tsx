import {
  Autocomplete,
  Box,
  Button,
  Input,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddNPCIcon from "@mui/icons-material/PersonAdd";
import { useCreateNPC } from "api/worlds/npcs/createNPC";

export interface FilterBarProps {
  worldId: string;
  worldOwnerId: string;
  search: string;
  setSearch: (search: string) => void;
  openNPC: (npc: string) => void;
}

export function FilterBar(props: FilterBarProps) {
  const { worldId, worldOwnerId, search, setSearch, openNPC } = props;

  const { createNPC, loading } = useCreateNPC();

  return (
    <Stack
      direction={"row"}
      spacing={2}
      display={"flex"}
      alignItems={"center"}
      sx={(theme) => ({
        px: 2,
        py: 1,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderColor: "divider",
        backgroundColor: theme.palette.background.paper,
      })}
    >
      <Input
        fullWidth
        startAdornment={
          <InputAdornment position={"start"}>
            <SearchIcon sx={(theme) => ({ color: theme.palette.grey[300] })} />
          </InputAdornment>
        }
        aria-label={"Filter NPCs by name or Location"}
        placeholder={"Filter NPCs by name or location"}
        value={search}
        onChange={(evt) => setSearch(evt.currentTarget.value)}
        color={"secondary"}
        sx={(theme) => ({
          mr: 2,
          flexGrow: 1,
        })}
      />
      <Button
        variant={"contained"}
        disabled={loading}
        sx={{ flexShrink: 0 }}
        endIcon={<AddNPCIcon />}
        onClick={() =>
          createNPC(worldId)
            .then((npcId) => openNPC(npcId))
            .catch(() => {})
        }
      >
        Add NPC
      </Button>
    </Stack>
  );
}
