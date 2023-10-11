import { Grid } from "@mui/material";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { useStore } from "stores/store";
import { StarforgedLocationDerelict } from "types/LocationStarforged.type";
import { GMSectionHeader } from "../../GMSectionHeader";

export interface DerelictContentProps {
  locationId: string;
  location: StarforgedLocationDerelict;
  showGMFields?: boolean;
  showGMTips?: boolean;
}

export function DerelictContent(props: DerelictContentProps) {
  const { locationId, location, showGMFields, showGMTips } = props;

  const updateLocation = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.updateLocation
  );

  const locationOracleId = location.location
    ?.toLocaleLowerCase()
    .replaceAll(" ", "_");

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

      {showGMFields && (
        <>
          {showGMTips ? <GMSectionHeader /> : <Grid item xs={0} sm={6} />}
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Location"}
              oracleTableId={"starforged/oracles/derelicts/canonical"}
              initialValue={location.location ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { location: value }).catch(() => {})
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Type"}
              oracleTableId={
                "starforged/oracles/derelicts/type/" + locationOracleId
              }
              initialValue={location.subType ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { subType: value }).catch(() => {})
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Condition"}
              oracleTableId={"starforged/oracles/derelicts/condition"}
              initialValue={location.condition ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { condition: value }).catch(() => {})
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Outer First Look"}
              oracleTableId={"starforged/oracles/derelicts/outer_first_look"}
              initialValue={location.outerFirstLook ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { outerFirstLook: value }).catch(
                  () => {}
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Inner First Look"}
              oracleTableId={"starforged/oracles/derelicts/inner_first_look"}
              initialValue={location.innerFirstLook ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { innerFirstLook: value }).catch(
                  () => {}
                )
              }
            />
          </Grid>
        </>
      )}
    </>
  );
}
