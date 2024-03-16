import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";
import { useStore } from "stores/store";

export interface AssetCardSearchProps {
  handleSearch: (groupId: string, assetId: string) => void;
}

export function AssetCardSearch(props: AssetCardSearchProps) {
  const { handleSearch } = props;

  const assetGroups = useStore(
    (store) => store.rules.assetMaps.assetCollectionMap
  );
  const options = useMemo(() => {
    return Object.values(assetGroups)
      .flatMap((group) =>
        Object.values(group.contents ?? {}).map((asset) => ({
          groupId: group.id,
          groupName: group.name,
          assetId: asset.id,
          name: asset.name,
        }))
      )
      .sort((a, b) => a.groupName.localeCompare(b.groupName));
  }, [assetGroups]);

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
          placeholder='Search'
        />
      )}
    />
  );
}
