import { Autocomplete, TextField } from "@mui/material";
import { assetGroups } from "data/assets";

export interface AssetCardSearchProps {
  handleSearch: (groupId: string, assetId: string) => void;
}

const options = assetGroups
  .flatMap((group) =>
    Object.values(group.Assets).map((asset) => ({
      groupId: group.$id,
      groupName: group.Title.Standard,
      assetId: asset.$id,
      name: asset.Title.Standard,
    }))
  )
  .sort((a, b) => a.groupName.localeCompare(b.groupName));

export function AssetCardSearch(props: AssetCardSearchProps) {
  const { handleSearch } = props;

  return (
    <Autocomplete
      options={options}
      groupBy={(option) => option.groupName}
      getOptionLabel={(option) => option.name}
      onChange={(evt, val) => val && handleSearch(val.groupId, val.assetId)}
      renderInput={(params) => (
        <TextField
          sx={{ mr: 2, minWidth: 200 }}
          {...params}
          placeholder="Search"
        />
      )}
    />
  );
}
