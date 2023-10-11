import { Alert, Grid } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";

export interface NotesSectionHeaderProps {
  sharedWithPlayers?: boolean;
}

export function NotesSectionHeader(props: NotesSectionHeaderProps) {
  const { sharedWithPlayers } = props;

  return (
    <>
      <Grid item xs={12}>
        <SectionHeading label={"GM & Player Notes"} breakContainer />
      </Grid>
      <Grid item xs={12}>
        <Alert severity={"info"}>
          Notes in this section will only be visible to gms & players in
          campaigns. Notes for singleplayer games should go in the above
          section.
        </Alert>
      </Grid>
      {!sharedWithPlayers && (
        <Grid item xs={12}>
          <Alert severity="warning">
            These notes are not yet visible to players because this location is
            hidden from them.
          </Alert>
        </Grid>
      )}
    </>
  );
}
