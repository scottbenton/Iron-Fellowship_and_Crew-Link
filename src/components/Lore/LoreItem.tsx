import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { Lore } from "stores/sharedLocationStore";
import AddPhotoIcon from "@mui/icons-material/Photo";
import HiddenIcon from "@mui/icons-material/VisibilityOff";
import { LoreTag } from "./LoreTag";

export interface LoreItemProps {
  lore: Lore;
  openLore: () => void;
  canUseImages: boolean;
  showHiddenTag?: boolean;
}

export function LoreItem(props: LoreItemProps) {
  const { lore, openLore, canUseImages, showHiddenTag } = props;

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
        {canUseImages && (
          <Box
            sx={(theme) => ({
              aspectRatio: "16/9",
              maxWidth: "100%",
              width: "100%",
              overflow: "hidden",
              backgroundImage: `url("${lore.imageUrls?.[0]}")`,
              backgroundColor: theme.palette.grey[300],
              backgroundSize: "cover",
              backgroundPosition: "center center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            {!lore.imageUrls?.length && (
              <AddPhotoIcon
                sx={(theme) => ({
                  width: 30,
                  height: 30,
                  color: theme.palette.grey[500],
                })}
              />
            )}
          </Box>
        )}
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
