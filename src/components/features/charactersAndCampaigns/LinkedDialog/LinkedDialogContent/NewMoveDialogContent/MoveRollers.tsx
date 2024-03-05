import { Datasworn } from "@datasworn/core";
import { Chip, Stack } from "@mui/material";

export interface MoveRollersProps {
  move: Datasworn.Move;
}

export function MoveRollers(props: MoveRollersProps) {
  const { move } = props;

  if (move.roll_type === "action_roll") {
    const stats: string[] = [];
    const conditionMeters: string[] = [];
    const assetControls: string[] = [];

    move.trigger.conditions.forEach((trigger) => {
      trigger.roll_options.forEach((option) => {
        if (option.using === "stat") {
          stats.push(option.stat);
        } else if (option.using === "condition_meter") {
          conditionMeters.push(option.condition_meter);
        } else if (option.using === "asset_control") {
          assetControls.push(option.control);
        }
      });
    });
    return (
      <Stack spacing={0.5} direction={"row"} flexWrap={"wrap"}>
        {stats.map((stat) => (
          <Chip key={stat} label={stat} sx={{ textTransform: "capitalize" }} />
        ))}
        {conditionMeters.map((conditionMeter) => (
          <Chip
            key={conditionMeter}
            label={conditionMeter}
            sx={{ textTransform: "capitalize" }}
          />
        ))}
        {assetControls.map((assetControl) => (
          <Chip
            key={assetControl}
            label={assetControl}
            sx={{ textTransform: "capitalize" }}
          />
        ))}
      </Stack>
    );
  } else if (move.roll_type === "progress_roll") {
    const trackCategory = move.tracks.category;
    return <Chip label={trackCategory} sx={{ textTransform: "capitalize" }} />;
  } else if (move.roll_type === "special_track") {
    const specialTracks: string[] = [];
    move.trigger.conditions.forEach((condition) => {
      condition.roll_options.forEach((option) =>
        specialTracks.push(option.using)
      );
    });

    return (
      <Stack spacing={0.5} direction={"row"} flexWrap={"wrap"}>
        {specialTracks.map((specialTrack) => (
          <Chip
            key={specialTrack}
            label={specialTrack}
            sx={{ textTransform: "capitalize" }}
          />
        ))}
      </Stack>
    );
  }

  return <></>;
}
