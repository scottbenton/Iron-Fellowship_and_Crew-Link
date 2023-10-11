import { Grid } from "@mui/material";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { useStore } from "stores/store";
import { StarforgedLocationStar } from "types/LocationStarforged.type";

export interface StarContentProps {
  locationId: string;
  location: StarforgedLocationStar;
}

export function StarContent(props: StarContentProps) {
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
      <Grid item xs={12}>
        <DebouncedOracleInput
          label={"Description"}
          oracleTableId={"starforged/oracles/space/stellar_object"}
          initialValue={location.description ?? ""}
          updateValue={(value) =>
            updateLocation(locationId, { description: value }).catch(() => {})
          }
        />
      </Grid>
    </>
  );
}
