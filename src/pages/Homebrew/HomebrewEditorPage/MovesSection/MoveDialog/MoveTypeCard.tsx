import { Box, Card, CardActionArea, Grid, Typography } from "@mui/material";
import { ActionIcon } from "assets/ActionIcon";
import { NoRollIcon } from "assets/NoRollIcon";
import { ProgressRollIcon } from "assets/ProgressRollIcon";
import { SpecialTrackIcon } from "assets/SpecialTrackIcon";
import { MoveType } from "types/homebrew/HomebrewMoves.type";
import SelectedIcon from "@mui/icons-material/CheckCircle";

export interface MoveTypeCardProps {
  moveType: MoveType;
  selected: boolean;
  onClick: () => void;
}

const configs: Record<MoveType, { Icon: typeof ActionIcon; label: string }> = {
  [MoveType.NoRoll]: {
    label: "No Roll",
    Icon: NoRollIcon,
  },
  [MoveType.ActionRoll]: {
    label: "Action Roll",
    Icon: ActionIcon,
  },
  [MoveType.ProgressRoll]: {
    label: "Progress Roll",
    Icon: ProgressRollIcon,
  },
  [MoveType.SpecialTrack]: {
    label: "Legacy Track Roll",
    Icon: SpecialTrackIcon,
  },
};

export function MoveTypeCard(props: MoveTypeCardProps) {
  const { moveType, onClick, selected } = props;

  const { label, Icon } = configs[moveType];

  return (
    <Grid item xs={12} sm={6}>
      <Card
        variant={"outlined"}
        sx={{
          height: "100%",
          borderColor: selected ? "primary.main" : "divider",
        }}
      >
        <CardActionArea
          onClick={onClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "100%",
          }}
        >
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Icon
              sx={(theme) => ({
                color: selected
                  ? theme.palette.primary[
                      theme.palette.mode === "light" ? "light" : "main"
                    ]
                  : theme.palette.grey[400],
                width: 64,
                height: 64,
              })}
            />
          </Box>
          <Box p={2} flexGrow={1}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"flex-start"}
            >
              <Typography variant={"h6"} component={"p"} lineHeight={1.25}>
                {label}
              </Typography>
              <Box width={24} height={24}>
                {selected && <SelectedIcon color={"primary"} />}
              </Box>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
