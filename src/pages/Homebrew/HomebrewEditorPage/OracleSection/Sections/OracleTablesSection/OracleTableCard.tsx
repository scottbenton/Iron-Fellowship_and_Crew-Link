import { Box, Card, CardActionArea, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { StoredOracleTable } from "types/homebrew/HomebrewOracles.type";

export interface OracleTableCardProps {
  oracle: StoredOracleTable;
  onClick: () => void;
}

export function OracleTableCard(props: OracleTableCardProps) {
  const { oracle, onClick } = props;

  return (
    <Card variant={"outlined"} component={"li"}>
      <CardActionArea
        onClick={onClick}
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant={"overline"} color={"textSecondary"}>
            Table
          </Typography>
          <Typography variant={"h6"}>{oracle.label}</Typography>
        </Box>
        <EditIcon color={"action"} />
      </CardActionArea>
    </Card>
  );
}
