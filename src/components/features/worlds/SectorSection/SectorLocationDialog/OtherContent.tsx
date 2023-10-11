import { Grid } from "@mui/material";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { useStore } from "stores/store";
import { StarforgedLocationOther } from "types/LocationStarforged.type";

export interface OtherContentProps {
  locationId: string;
  location: StarforgedLocationOther;
}
export function OtherContent(props: OtherContentProps) {
  const { locationId, location } = props;

  const updateLocation = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.updateLocation
  );

  return (
    <>
      <Grid item xs={12} sm={6}>
        <DebouncedOracleInput
          label={"Name"}
          oracleTableId={undefined}
          initialValue={location.name}
          updateValue={(value) =>
            updateLocation(locationId, { name: value }).catch(() => {})
          }
        />
      </Grid>
    </>
  );
}
