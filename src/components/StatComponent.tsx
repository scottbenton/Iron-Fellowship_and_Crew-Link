import { Box, ButtonBase, Card, SxProps, Typography } from "@mui/material";

import PlusIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import { useState } from "react";
import { useRoller } from "../providers/DieRollProvider";

export interface StatComponentProps {
  label: string;
  value: number;
  updateTrack?: {
    min: number;
    max: number;
    handleChange: (newValue: number) => Promise<boolean>;
  };
  disableRoll?: boolean;
  sx?: SxProps;
}

export function StatComponent(props: StatComponentProps) {
  const { label, value, updateTrack, disableRoll, sx } = props;

  const { rollStat } = useRoller();

  const [loading, setLoading] = useState<boolean>(false);

  const handleStatUpdate = (newValue: number) => {
    if (
      updateTrack &&
      newValue >= updateTrack.min &&
      newValue <= updateTrack.max
    ) {
      setLoading(true);
      updateTrack
        .handleChange(newValue)
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Card
      variant={"outlined"}
      sx={[
        (theme) => ({
          borderRadius: theme.shape.borderRadius,
          overflow: "hidden",
          width: 75,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          transition: theme.transitions.create(
            ["background-color", "border-color"],
            { duration: theme.transitions.duration.shorter }
          ),
          "&>h6": {
            transition: theme.transitions.create(
              ["background-color", "color"],
              { duration: theme.transitions.duration.shorter }
            ),
            backgroundColor: theme.palette.grey[100],
            color: theme.palette.grey[600],
            fontFamily: theme.fontFamilyTitle,
            py: 0.5,
          },
          "&:hover":
            updateTrack || disableRoll
              ? {}
              : {
                  "&>h6": {
                    backgroundColor: theme.palette.grey[300],
                    color: theme.palette.grey[800],
                  },
                  borderColor: theme.palette.secondary.main,
                },
        }),

        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      component={updateTrack || disableRoll ? "div" : ButtonBase}
      onClick={() => {
        !(updateTrack || disableRoll) && rollStat(label, value);
      }}
    >
      <Typography
        display={"block"}
        textAlign={"center"}
        variant={"subtitle1"}
        lineHeight={1}
      >
        {label}
      </Typography>
      <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
        {updateTrack && (
          <ButtonBase
            onClick={() => handleStatUpdate(value + 1)}
            sx={(theme) => ({
              width: "100%",
              color: theme.palette.grey[600],
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            })}
          >
            <PlusIcon sx={{ width: 20, height: 20 }} />
          </ButtonBase>
        )}
        <Typography
          sx={[
            (theme) => ({
              color: theme.palette.grey[700],
              paddingX: 0,
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }),
            updateTrack ? { lineHeight: "1.5rem" } : {},
          ]}
          variant={"h6"}
          textAlign={"center"}
        >
          <Typography
            component={"span"}
            variant={"body1"}
            mr={0.2}
            color={(theme) => theme.palette.grey[500]}
          >
            {value > 0 ? "+" : ""}
          </Typography>
          {value}
        </Typography>
        {updateTrack && (
          <ButtonBase
            onClick={() => handleStatUpdate(value - 1)}
            sx={(theme) => ({
              width: "100%",
              color: theme.palette.grey[600],
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            })}
          >
            <MinusIcon sx={{ width: 20, height: 20 }} />
          </ButtonBase>
        )}
      </Box>
    </Card>
  );
}
