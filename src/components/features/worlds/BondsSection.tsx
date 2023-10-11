import {
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "providers/SnackbarProvider";

export interface BondsSectionProps {
  onBondToggle?: (bonded: boolean) => void;
  isBonded: boolean;
  bondedCharacters?: string[];
  disableToggle?: boolean;
  inheritedBondName?: string;
}

export function BondsSection(props: BondsSectionProps) {
  const {
    onBondToggle,
    isBonded,
    bondedCharacters,
    disableToggle,
    inheritedBondName,
  } = props;

  const { info } = useSnackbar();

  return (
    <>
      {onBondToggle && (
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                disabled={disableToggle}
                checked={isBonded ?? false}
                onChange={(evt, value) => {
                  onBondToggle(value);
                  info(
                    "Don't forget to update your Bonds track on the Tracks Tab"
                  );
                }}
              />
            }
            label={
              "Bonded" +
              (inheritedBondName && disableToggle
                ? ` via ${inheritedBondName}`
                : "")
            }
          />
        </Grid>
      )}
      {bondedCharacters && bondedCharacters.length > 0 && (
        <Grid item xs={12}>
          <Typography variant={"caption"} color={"textSecondary"}>
            Bonded Characters
          </Typography>
          <Stack direction={"row"} spacing={1} flexWrap={"wrap"}>
            {bondedCharacters.map((characterName, index) => (
              <Chip key={index} variant={"outlined"} label={characterName} />
            ))}
          </Stack>
        </Grid>
      )}
    </>
  );
}
