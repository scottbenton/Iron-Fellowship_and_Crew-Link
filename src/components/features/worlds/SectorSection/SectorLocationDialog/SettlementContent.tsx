import { Grid } from "@mui/material";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { useStore } from "stores/store";
import { StarforgedLocationSettlement } from "types/LocationStarforged.type";
import { GMSectionHeader } from "../../GMSectionHeader";

export interface SettlementContentProps {
  locationId: string;
  location: StarforgedLocationSettlement;
  showGMFields?: boolean;
  showGMTips?: boolean;
}

export function SettlementContent(props: SettlementContentProps) {
  const { locationId, location, showGMFields, showGMTips } = props;

  const region = useStore((store) => {
    const worldSectors = store.worlds.currentWorld.currentWorldSectors;
    return worldSectors.openSectorId
      ? worldSectors.sectors[
          worldSectors.openSectorId
        ].region?.toLocaleLowerCase()
      : undefined;
  });

  const updateLocation = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.updateLocation
  );

  return (
    <>
      <Grid item xs={12} sm={6}>
        <DebouncedOracleInput
          label={"Settlement Name"}
          oracleTableId={"starforged/oracles/settlements/name"}
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
              oracleTableId={"starforged/oracles/settlements/location"}
              initialValue={location.location ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { location: value }).catch(() => {});
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"First Look"}
              oracleTableId={"starforged/oracles/settlements/first_look"}
              initialValue={location.firstLook ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { firstLook: value }).catch(
                  () => {}
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Initial Contact"}
              oracleTableId={"starforged/oracles/settlements/initial_contact"}
              initialValue={location.initialContact ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { initialContact: value }).catch(
                  () => {}
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Authority"}
              oracleTableId={"starforged/oracles/settlements/authority"}
              initialValue={location.authority ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { authority: value }).catch(
                  () => {}
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Projects"}
              oracleTableId={"starforged/oracles/settlements/projects"}
              initialValue={location.projects ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { projects: value }).catch(() => {});
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Trouble"}
              oracleTableId={"starforged/oracles/settlements/trouble"}
              initialValue={location.trouble ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { trouble: value }).catch(() => {});
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Population"}
              oracleTableId={
                "starforged/oracles/settlements/population/" + region
              }
              initialValue={location.population ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { population: value }).catch(
                  () => {}
                );
              }}
            />
          </Grid>
        </>
      )}
    </>
  );
}
