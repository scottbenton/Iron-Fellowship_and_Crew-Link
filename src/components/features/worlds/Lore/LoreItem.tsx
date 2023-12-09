import { Box, Card, CardActionArea, Typography } from "@mui/material";
import AddPhotoIcon from "@mui/icons-material/Photo";
import HiddenIcon from "@mui/icons-material/VisibilityOff";
import { LoreTag } from "./LoreTag";
import { LoreDocumentWithGMProperties } from "stores/world/currentWorld/lore/lore.slice.type";

export interface LoreItemProps {
  lore: LoreDocumentWithGMProperties;
  openLore: () => void;
  showHiddenTag?: boolean;
}

export function LoreItem(props: LoreItemProps) {
  const { lore, openLore, showHiddenTag } = props;

  return (
    <Card variant={"outlined"} sx={{ height: "100%" }}>
      <CardActionArea
        onClick={() => openLore()}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={(theme) => ({
            aspectRatio: "16/9",
            maxWidth: "100%",
            width: "100%",
            overflow: "hidden",
            backgroundImage: `url("${lore.imageUrl}")`,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[300]
                : theme.palette.grey[700],
            backgroundSize: "cover",
            backgroundPosition: "center center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          {!lore.imageUrl && (
            <AddPhotoIcon
              sx={(theme) => ({
                width: 30,
                height: 30,
                color:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[500]
                    : theme.palette.grey[300],
              })}
            />
          )}
        </Box>
        <Box
          p={2}
          flexGrow={1}
          display={"flex"}
          alignItems={"flex-start"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography>{lore.name}</Typography>
            <Box
              sx={{
                display: "flex",
                "&>*": {
                  mt: 0.5,
                  mr: 0.5,
                },
              }}
            >
              {lore.tags?.map((tag) => (
                <LoreTag size={"small"} label={tag} key={tag} />
              ))}
            </Box>
          </Box>

          {!lore.sharedWithPlayers && showHiddenTag && (
            <HiddenIcon color={"action"} />
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}
