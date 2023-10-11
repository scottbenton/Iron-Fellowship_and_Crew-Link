import { Box, Grid, Typography } from "@mui/material";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { useStore } from "stores/store";
import { StarforgedLocationVault } from "types/LocationStarforged.type";
import { GMSectionHeader } from "../../GMSectionHeader";

export interface VaultContentProps {
  locationId: string;
  location: StarforgedLocationVault;
  showGMFields?: boolean;
  showGMTips?: boolean;
}

export function VaultContent(props: VaultContentProps) {
  const { locationId, location, showGMFields, showGMTips } = props;

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
      {showGMFields && (
        <>
          {showGMTips ? <GMSectionHeader /> : <Grid item xs={0} sm={6} />}
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Location"}
              oracleTableId={"starforged/oracles/vaults/location"}
              initialValue={location.location ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { location: value }).catch(() => {})
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Scale"}
              oracleTableId={"starforged/oracles/vaults/scale"}
              initialValue={location.scale ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { scale: value }).catch(() => {})
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Form"}
              oracleTableId={"starforged/oracles/vaults/form"}
              initialValue={location.form ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { form: value }).catch(() => {})
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Shape"}
              oracleTableId={"starforged/oracles/vaults/shape"}
              initialValue={location.shape ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { shape: value }).catch(() => {})
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Material"}
              oracleTableId={"starforged/oracles/vaults/material"}
              initialValue={location.material ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { material: value }).catch(() => {})
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Outer First Look"}
              oracleTableId={"starforged/oracles/vaults/outer_first_look"}
              initialValue={location.outerFirstLook ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { outerFirstLook: value }).catch(
                  () => {}
                )
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Typography variant={"overline"}>Interior</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"First Look"}
              oracleTableId={"starforged/oracles/vaults/interior/first_look"}
              initialValue={location.innerFirstLook ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { innerFirstLook: value }).catch(
                  () => {}
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Feature"}
              oracleTableId={"starforged/oracles/vaults/interior/feature"}
              initialValue={location.interiorFeature ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { interiorFeature: value }).catch(
                  () => {}
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Peril"}
              oracleTableId={"starforged/oracles/vaults/interior/peril"}
              initialValue={location.interiorPeril ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { interiorPeril: value }).catch(
                  () => {}
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Opportunity"}
              oracleTableId={"starforged/oracles/vaults/interior/opportunity"}
              initialValue={location.interiorOpportunity ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, {
                  interiorOpportunity: value,
                }).catch(() => {})
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Typography variant={"overline"}>Exterior</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Purpose"}
              oracleTableId={"starforged/oracles/vaults/sanctum/purpose"}
              initialValue={location.sanctumPurpose ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { sanctumPurpose: value }).catch(
                  () => {}
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Feature"}
              oracleTableId={"starforged/oracles/vaults/sanctum/feature"}
              initialValue={location.sanctumFeature ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { sanctumFeature: value }).catch(
                  () => {}
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Peril"}
              oracleTableId={"starforged/oracles/vaults/sanctum/peril"}
              initialValue={location.sanctumPeril ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, { sanctumPeril: value }).catch(
                  () => {}
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Opportunity"}
              oracleTableId={"starforged/oracles/vaults/sanctum/opportunity"}
              initialValue={location.sanctumOpportunity ?? ""}
              updateValue={(value) =>
                updateLocation(locationId, {
                  sanctumOpportunity: value,
                }).catch(() => {})
              }
            />
          </Grid>
        </>
      )}
    </>
  );
}
