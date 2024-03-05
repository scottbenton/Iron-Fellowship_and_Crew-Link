import { Control, Controller } from "react-hook-form";
import { Form } from "./MoveDialogForm";
import { MoveType } from "types/homebrew/HomebrewMoves.type";
import { Box, Grid, Typography } from "@mui/material";
import { MoveTypeCard } from "./MoveTypeCard";

const moveTypes: MoveType[] = [
  MoveType.NoRoll,
  MoveType.ActionRoll,
  MoveType.ProgressRoll,
  MoveType.SpecialTrack,
];

export interface MoveTypeInputProps {
  control: Control<Form>;
}

export function MoveTypeInput(props: MoveTypeInputProps) {
  const { control } = props;

  return (
    <Box>
      <Typography variant={"overline"}>Move Type</Typography>
      <Controller
        control={control}
        name={"type"}
        defaultValue={MoveType.NoRoll}
        render={({ field: { onChange, value } }) => (
          <Grid container spacing={1}>
            {moveTypes.map((moveType) => (
              <MoveTypeCard
                key={moveType}
                moveType={moveType}
                selected={value === moveType}
                onClick={() => onChange(moveType)}
              />
            ))}
          </Grid>
        )}
      />
    </Box>
  );
}
