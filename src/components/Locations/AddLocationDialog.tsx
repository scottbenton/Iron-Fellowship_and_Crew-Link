import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { SectionHeading } from "components/SectionHeading";
import { TextFieldWithOracle } from "components/TextFieldWithOracle/TextFieldWithOracle";
import { useRoller } from "providers/DieRollProvider";
import { useState } from "react";
import { LocationNameInput } from "./LocationNameInput";

export interface AddLocationDialogProps {
  open: boolean;
  onClose: () => void;
  isGM?: boolean;
  isCampaign?: boolean;
}

export function AddLocationDialog(props: AddLocationDialogProps) {
  const { open, onClose } = props;

  const { rollOracleTable } = useRoller();

  const [locationName, setLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"sm"} fullWidth>
      <DialogTitleWithCloseButton onClose={onClose}>
        Add a Location
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Grid container spacing={2} sx={{ py: 1 }}>
          <Grid item xs={12}>
            <SectionHeading label={"Public"} />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocationNameInput name={locationName} setName={setLocationName} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextFieldWithOracle
              label={"Description"}
              value={locationDescription}
              onChange={setLocationDescription}
              getOracleValue={() =>
                rollOracleTable("ironsworn/oracles/place/descriptor", false) ??
                ""
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant={"contained"}>Add Location</Button>
      </DialogActions>
    </Dialog>
  );
}
