import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
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
      //@ts-ignore
      getOptionLabel={(option) => option.inputValue}
      //@ts-ignore
      isOptionEqualToValue={(option, value) =>
        option.inputValue === value.inputValue
      }
      //@ts-ignore
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          //@ts-ignore
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
      //@ts-ignore
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      value={tags?.map((tag) => ({ title: tag, inputValue: tag })) ?? []}
      //@ts-ignore
      onChange={(evt, newValue) => handleTagsChange(newValue)}
      renderInput={(params) => <TextField {...params} label={"Tags"} />}
      //@ts-ignore
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          //@ts-ignore
          <LoreTag label={option.title} {...getTagProps({ index })} />
        ))
      }
    />
  );
}
