import { Box, Divider, Typography } from "@mui/material";
import { D6Icon } from "assets/D6Icon";
import { D10Icon } from "assets/D10Icon";

export interface RollValuesProps {
  d10Results?: [number, number] | number;
  d6Result?: {
    action: number;
    modifier?: number;
    adds?: number;
    rollTotal: number;
  };
  fixedResult?: {
    title: string;
    value: string | number;
  };
  isExpanded: boolean;
}
export function RollValues(props: RollValuesProps) {
  const { d10Results, d6Result, fixedResult, isExpanded } = props;

  if (!isExpanded) {
    return null;
  }

  return (
    <>
      <Box>
        {d6Result && (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <D6Icon />
            <Typography
              ml={1}
              color={(theme) => theme.palette.grey[200]}
              sx={
                d6Result.action === 1
                  ? {
                      borderRadius: 1,
                      borderColor: "primary.light",
                      borderWidth: 1,
                      borderStyle: "solid",
                      px: 0.5,
                      mr: -0.5,
                    }
                  : {}
              }
            >
              {d6Result.action}
            </Typography>
            <Typography ml={1} color={(theme) => theme.palette.grey[200]}>
              {d6Result.modifier ? ` + ${d6Result.modifier}` : ""}
              {d6Result.adds ? ` + ${d6Result.adds}` : ""}
              {d6Result.modifier || d6Result.adds
                ? ` = ${
                    d6Result.rollTotal > 10 ? "10 (Max)" : d6Result.rollTotal
                  }`
                : ""}
            </Typography>
          </Box>
        )}
        {fixedResult && (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography color={(theme) => theme.palette.grey[200]}>
              {fixedResult.title}: {fixedResult.value}
            </Typography>
          </Box>
        )}
        {d10Results && (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <D10Icon />
            <Typography ml={1} color={(theme) => theme.palette.grey[200]}>
              {Array.isArray(d10Results)
                ? `${d10Results[0]}, ${d10Results[1]}`
                : d10Results}
            </Typography>
          </Box>
        )}
      </Box>
      <Divider
        orientation={"vertical"}
        sx={(theme) => ({
          alignSelf: "stretch",
          borderColor: theme.palette.grey[400],
          height: "auto",
          mx: 2,
        })}
      />
    </>
  );
}
