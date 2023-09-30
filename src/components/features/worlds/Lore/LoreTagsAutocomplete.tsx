import {
  Autocomplete,
  Chip,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { getHSLFromString, getHueFromString } from "functions/getHueFromString";
import { useCallback, useState } from "react";
import { LoreTag } from "./LoreTag";

export interface LoreTagsAutocompleteProps {
  tags?: string[];
  updateTags: (tags: string[]) => void;
  tagList: string[];
}
const filter = createFilterOptions<{ title: string; inputValue: string }>();

export function LoreTagsAutocomplete(props: LoreTagsAutocompleteProps) {
  const { tags, updateTags, tagList } = props;

  const mappedTagList = tagList.map((tag) => ({ title: tag, inputValue: tag }));

  const handleTagsChange = (
    updatedTags: { title: string; inputValue: string }[]
  ) => {
    updateTags(updatedTags.map((tag) => tag.inputValue));
  };

  return (
    <Autocomplete
      getOptionLabel={(option) => option.inputValue}
      isOptionEqualToValue={(option, value) =>
        option.inputValue === value.inputValue
      }
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.title
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({ title: `New Tag: ${inputValue}`, inputValue });
        }

        return filtered;
      }}
      multiple
      options={mappedTagList}
      includeInputInList
      noOptionsText={"Type a name for your new tag"}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      value={tags?.map((tag) => ({ title: tag, inputValue: tag })) ?? []}
      onChange={(evt, newValue) => handleTagsChange(newValue)}
      renderInput={(params) => <TextField {...params} label={"Tags"} />}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <LoreTag label={option.title} {...getTagProps({ index })} />
        ))
      }
    />
  );
}
