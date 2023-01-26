import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { assets } from "../../data/assets";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Asset, ASSET_TYPES } from "../../types/Asset.type";
import { SectionHeading } from "../SectionHeading";

export interface CreateCustomAssetProps {
  handleSelect: (asset: Asset) => void;
  startingAsset?: Asset;
}

const copyAsset = (asset?: Asset) => {
  if (!asset) {
    return undefined;
  } else {
    return JSON.parse(JSON.stringify(asset)) as Asset;
  }
};

export function CreateCustomAsset(props: CreateCustomAssetProps) {
  const { handleSelect, startingAsset } = props;
  const { error } = useSnackbar();

  const [customAsset, setCustomAsset] = useState<Asset>(
    copyAsset(startingAsset) ?? {
      id: "",
      name: "",
      type: ASSET_TYPES.COMPANION,
      abilities: [{ text: "" }, { text: "" }, { text: "" }],
    }
  );

  const setType = (type: ASSET_TYPES) => {
    setCustomAsset((prevAsset) => {
      let newAsset = { ...prevAsset };
      newAsset.type = type;
      return newAsset;
    });
  };

  const setName = (name: string) => {
    setCustomAsset((prevAsset) => {
      let newAsset = { ...prevAsset };
      newAsset.id =
        "custom-" + newAsset.name.toLocaleLowerCase().replaceAll(" ", "-");
      newAsset.name = name;
      return newAsset;
    });
  };

  const setDescription = (description: string) => {
    setCustomAsset((prevAsset) => {
      let newAsset = { ...prevAsset };
      newAsset.description = description;
      return newAsset;
    });
  };

  const setAbilityName = (index: number, name: string) => {
    setCustomAsset((prevAsset) => {
      let newAsset = { ...prevAsset };
      if (!Array.isArray(newAsset.abilities)) {
        newAsset.abilities = [];
      }
      newAsset.abilities[index].name = name;
      return newAsset;
    });
  };

  const setAbilityDescription = (index: number, description: string) => {
    setCustomAsset((prevAsset) => {
      let newAsset = { ...prevAsset };
      if (!Array.isArray(newAsset.abilities)) {
        newAsset.abilities = [{ text: "" }, { text: "" }, { text: "" }];
      }
      newAsset.abilities[index].text = description;
      return newAsset;
    });
  };

  const handleSubmit = () => {
    if (
      !customAsset.name ||
      !customAsset.type ||
      !customAsset.abilities[0].text ||
      !customAsset.abilities[1].text ||
      !customAsset.abilities[2].text
    ) {
      error("Please fill out all the required fields before selecting");
      return;
    }

    handleSelect(customAsset);
  };

  return (
    <>
      <SectionHeading label={"Asset Basics"} sx={{ mt: 1 }} />
      <Stack spacing={2} mt={2}>
        <TextField
          label={"Asset Type"}
          select
          required
          value={customAsset.type}
          onChange={(evt) => setType(evt.target.value as ASSET_TYPES)}
        >
          <MenuItem value={ASSET_TYPES.COMPANION}>Companion</MenuItem>
          <MenuItem value={ASSET_TYPES.PATH}>Path</MenuItem>
          <MenuItem value={ASSET_TYPES.COMBAT_TALENT}>Combat Talent</MenuItem>
          <MenuItem value={ASSET_TYPES.RITUAL}>Ritual</MenuItem>
        </TextField>
        <TextField
          label={"Asset Name"}
          required
          value={customAsset.name}
          onChange={(evt) => setName(evt.target.value)}
        />
        <TextField
          label={"Asset Description"}
          value={customAsset.description ?? ""}
          onChange={(evt) => setDescription(evt.target.value)}
        />
      </Stack>

      <SectionHeading label={"Asset Abilities"} sx={{ mt: 4 }} />
      <Stack spacing={2} mt={2}>
        <TextField
          label={"Ability #1 Name"}
          value={customAsset.abilities[0].name}
          onChange={(evt) => setAbilityName(0, evt.target.value)}
        />
        <TextField
          label={"Ability #1 Description"}
          helperText={"Supports Markdown"}
          multiline
          minRows={2}
          required
          value={customAsset.abilities[0].text}
          onChange={(evt) => setAbilityDescription(0, evt.target.value)}
        />
        <TextField
          label={"Ability #2 Name"}
          value={customAsset.abilities[1].name}
          onChange={(evt) => setAbilityName(1, evt.target.value)}
        />
        <TextField
          label={"Ability #2 Description"}
          helperText={"Supports Markdown"}
          multiline
          minRows={2}
          required
          value={customAsset.abilities[1].text}
          onChange={(evt) => setAbilityDescription(1, evt.target.value)}
        />
        <TextField
          label={"Ability #3 Name"}
          value={customAsset.abilities[2].name}
          onChange={(evt) => setAbilityName(2, evt.target.value)}
        />
        <TextField
          label={"Ability #3 Description"}
          helperText={"Supports Markdown"}
          multiline
          minRows={2}
          required
          value={customAsset.abilities[2].text}
          onChange={(evt) => setAbilityDescription(2, evt.target.value)}
        />
        <Box display={"flex"} justifyContent={"flex-end"}>
          <Button variant={"contained"} onClick={() => handleSubmit()}>
            {startingAsset ? "Update Custom Asset" : "Select Custom Asset"}
          </Button>
        </Box>
      </Stack>
    </>
  );
}
