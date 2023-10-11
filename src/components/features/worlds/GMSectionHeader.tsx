import { Alert, Grid } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";

export function GMSectionHeader() {
  return (
    <>
      <Grid item xs={12}>
        <SectionHeading label={"GM Only"} breakContainer />
      </Grid>
      <Grid item xs={12}>
        <Alert severity={"info"}>
          Information in this section will not be shared with your players.
        </Alert>
      </Grid>
    </>
  );
}
