import { Box, Card, CardActionArea, Typography } from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import HiddenIcon from "@mui/icons-material/VisibilityOff";
import { LocationDocumentWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { NPCDocumentWithGMProperties } from "stores/world/currentWorld/npcs/npcs.slice.type";

export interface NPCItemProps {
  npc: NPCDocumentWithGMProperties;
  locations: { [key: string]: LocationDocumentWithGMProperties };
  openNPC: () => void;
  canUseImages: boolean;
  showHiddenTag?: boolean;
}

export function NPCItem(props: NPCItemProps) {
  const { npc, locations, openNPC, canUseImages, showHiddenTag } = props;

  const npcLocation = npc.lastLocationId
    ? locations[npc.lastLocationId]
    : undefined;

  return (
    <Card variant={"outlined"} sx={{ overflow: "visible" }}>
      <CardActionArea
        onClick={() => openNPC()}
        sx={(theme) => ({
          p: 2,
          "& #portrait": {
            marginTop: -3,
            marginLeft: -1,
            transitionProperty: "margin-top margin-bottom",
            transitionDuration: `${theme.transitions.duration.shorter}ms`,
            transitionTimingFunction: theme.transitions.easing.easeInOut,
          },
          "&:hover": {
            "& #portrait": {
              marginTop: -1.5,
              marginBottom: -1.5,
            },
          },
        })}
      >
        <Box display={"flex"} alignItems={"start"}>
          {canUseImages && (
            <Box
              id={"portrait"}
              sx={(theme) => ({
                marginRight: 1,
                borderWidth: 2,
                borderColor: theme.palette.divider,
                borderStyle: "solid",
                width: 80,
                height: 80,
                flexShrink: 0,
                borderRadius: theme.shape.borderRadius,
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[300]
                    : theme.palette.grey[700],
                backgroundImage: `url(${npc.imageUrl})`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              {!npc.imageUrl && (
                <PhotoIcon
                  sx={(theme) => ({
                    color:
                      theme.palette.mode === "light"
                        ? theme.palette.grey[500]
                        : theme.palette.grey[300],
                  })}
                />
              )}
            </Box>
          )}
          <Box
            display={"flex"}
            alignItems={"flex-start"}
            justifyContent={"space-between"}
            flexGrow={1}
          >
            <Box>
              <Typography>{npc.name}</Typography>
              {npcLocation && (
                <Typography variant={"caption"} color={"textSecondary"}>
                  {npcLocation.name}
                </Typography>
              )}
            </Box>
            {!npc.sharedWithPlayers && showHiddenTag && (
              <HiddenIcon color={"action"} />
            )}
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
