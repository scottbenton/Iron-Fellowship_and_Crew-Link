import { StarforgedLocation } from "types/LocationStarforged.type";
import { hexTypeMap } from "./hexTypes";
import { Box, Card, CardActionArea, Typography } from "@mui/material";

export interface SectorLocationCardProps {
  sectorLocation: StarforgedLocation;
  onClick: () => void;
}

export function SectorLocationCard(props: SectorLocationCardProps) {
  const { sectorLocation, onClick } = props;

  const { type, name } = sectorLocation;
  const { Icon, color = "#fff" } = hexTypeMap[type];

  return (
    <Card variant={"outlined"}>
      <CardActionArea
        sx={{
          display: "flex",
          alignItems: "start",
          p: 2,
          justifyContent: "flex-start",
        }}
        onClick={onClick}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          width={32}
          height={32}
          borderRadius={"100%"}
          bgcolor={(theme) => theme.palette.grey[800]}
        >
          <Icon sx={{ color }} />
        </Box>
        <Typography sx={{ ml: 2, alignSelf: "center" }}>{name}</Typography>
      </CardActionArea>
    </Card>
  );
}
