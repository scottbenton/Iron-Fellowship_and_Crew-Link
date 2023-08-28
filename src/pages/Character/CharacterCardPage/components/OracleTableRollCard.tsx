import { Box, Divider, Typography } from "@mui/material";
import { OracleTableRoll } from "types/DieRolls.type";
import { D10Icon } from "assets/D10Icon";
import { MarkdownRenderer } from "components/MarkdownRenderer";

export interface OracleTableRollCardProps {
  roll: OracleTableRoll;
}

export function OracleTableRollCard(props: OracleTableRollCardProps) {
  const { roll } = props;

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      })}
    >
      <Typography variant={"h4"} fontFamily={(theme) => theme.fontFamilyTitle}>
        {roll.rollLabel}
      </Typography>
      <Box display={"flex"} alignItems={"center"} flexDirection={"row"} mt={1}>
        <Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <div>
              <D10Icon sx={{ width: 40, height: 40 }} />
              <D10Icon sx={{ width: 40, height: 40 }} />
            </div>
            <Typography
              ml={3}
              variant={"h4"}
              color={(theme) => theme.palette.grey[200]}
            >
              {roll.roll}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
