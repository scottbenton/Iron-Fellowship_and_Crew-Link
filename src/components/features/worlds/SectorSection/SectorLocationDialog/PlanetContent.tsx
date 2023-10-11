import { Alert, Grid, MenuItem, TextField } from "@mui/material";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import { SectionHeading } from "components/shared/SectionHeading";
import { useStore } from "stores/store";
import { StarforgedLocationPlanet } from "types/LocationStarforged.type";
import { GMSectionHeader } from "../../GMSectionHeader";

export interface PlanetContentProps {
  locationId: string;
  location: StarforgedLocationPlanet;
  showGMFields?: boolean;
  showGMTips?: boolean;
}

export function PlanetContent(props: PlanetContentProps) {
  const { locationId, location, showGMFields, showGMTips } = props;

  const region = useStore((store) => {
    const worldSectors = store.worlds.currentWorld.currentWorldSectors;
    return worldSectors.openSectorId
      ? worldSectors.sectors[
          worldSectors.openSectorId
        ].region?.toLocaleLowerCase()
      : undefined;
  });

  const { subType } = location;
  const baseSubTypeId = `starforged/oracles/planets/${subType}`;

  const updateLocation = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldSectors.locations.updateLocation
  );

  const updateClass = (planetClass: string) => {
    const convertedClass = planetClass?.split(" ")[0].toLocaleLowerCase();
    updateLocation(locationId, {
      subType: convertedClass,
      planetClassName: planetClass,
    });
  };

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          label={"Planet Class"}
          value={location.planetClassName ?? ""}
          onChange={(evt) => updateClass(evt.target.value)}
          fullWidth
        >
          <MenuItem value={"Desert World"}>Desert World</MenuItem>
          <MenuItem value={"Furnace World"}>Furnace World</MenuItem>
          <MenuItem value={"Grave World"}>Grave World</MenuItem>
          <MenuItem value={"Ice World"}>Ice World</MenuItem>
          <MenuItem value={"Jovian World"}>Jovian World</MenuItem>
          <MenuItem value={"Jungle World"}>Jungle World</MenuItem>
          <MenuItem value={"Ocean World"}>Ocean World</MenuItem>
          <MenuItem value={"Rocky World"}>Rocky World</MenuItem>
          <MenuItem value={"Shattered World"}>Shattered World</MenuItem>
          <MenuItem value={"Tainted World"}>Tainted World</MenuItem>
          <MenuItem value={"Vital World"}>Vital World</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <DebouncedOracleInput
          label={"Planet Name"}
          oracleTableId={baseSubTypeId + "/sample_names"}
          initialValue={location.name}
          updateValue={(value) =>
            updateLocation(locationId, { name: value }).catch(() => {})
          }
        />
      </Grid>
      <Grid item xs={12}>
        <DebouncedOracleInput
          label={"Description"}
          oracleTableId={undefined}
          initialValue={location.description ?? ""}
          updateValue={(value) => {
            updateLocation(locationId, { description: value }).catch(() => {});
          }}
        />
      </Grid>
      {showGMFields && (
        <>
          {showGMTips && <GMSectionHeader />}
          <Grid item xs={12}>
            <DebouncedOracleInput
              label={"Feature"}
              oracleTableId={baseSubTypeId + "/planetside_feature"}
              initialValue={location.feature ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { feature: value }).catch(() => {});
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Atmosphere"}
              oracleTableId={baseSubTypeId + "/atmosphere"}
              initialValue={location.atmosphere ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { atmosphere: value }).catch(
                  () => {}
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Settlements"}
              oracleTableId={baseSubTypeId + "/settlements/" + region}
              initialValue={location.settlements ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { settlements: value }).catch(
                  () => {}
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Life"}
              oracleTableId={baseSubTypeId + "/life"}
              initialValue={location.life ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { life: value }).catch(() => {});
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DebouncedOracleInput
              label={"Observed From Space"}
              oracleTableId={baseSubTypeId + "/observed_from_space"}
              initialValue={location.observedFromSpace ?? ""}
              updateValue={(value) => {
                updateLocation(locationId, { observedFromSpace: value }).catch(
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
