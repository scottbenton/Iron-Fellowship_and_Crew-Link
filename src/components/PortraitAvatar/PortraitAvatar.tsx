import { Translate } from "@mui/icons-material";
import { Box, Typography, TypographyVariant, Skeleton } from "@mui/material";
import { useListenToCharacterPortraitUrl } from "api/characters/getCharacterPortraitUrl";
import { getHueFromString } from "functions/getHueFromString";
import { useState } from "react";
import { useCharacterPortraitStore } from "stores/characterPortrait.store";

type AvatarSizes = "small" | "medium" | "large";

const sizes: { [key in AvatarSizes]: number } = {
  small: 40,
  medium: 60,
  large: 80,
};

const variants: { [key in AvatarSizes]: TypographyVariant } = {
  small: "h6",
  medium: "h5",
  large: "h4",
};

export interface PortraitAvatarProps {
  uid: string;
  characterId: string;
  filename?: string;
  name?: string;
  portraitSettings?: {
    position: {
      x: number;
      y: number;
    };
    scale: number;
  };
  size?: AvatarSizes;
  colorful?: boolean;
}

export function PortraitAvatar(props: PortraitAvatarProps) {
  const {
    uid,
    characterId,
    filename,
    name,
    portraitSettings,
    colorful,
    size = "medium",
  } = props;

  useListenToCharacterPortraitUrl(uid, characterId, filename);
  const portraitUrl: string | undefined = useCharacterPortraitStore(
    (store) => store.portraitUrls[characterId]
  );

  const [isTaller, setIsTaller] = useState<boolean>(true);

  let marginLeft = 0;
  let marginTop = 0;
  if (portraitSettings) {
    marginLeft = portraitSettings.position.x * -100;
    marginTop = portraitSettings.position.y * -100;
  }

  const scale = portraitSettings?.scale ?? 1;

  const shouldShowColor = colorful && !portraitUrl;
  const hue = getHueFromString(characterId);

  return (
    <Box
      width={sizes[size]}
      height={sizes[size]}
      overflow={"hidden"}
      sx={(theme) => ({
        backgroundColor: shouldShowColor
          ? `hsl(${hue}, 60%, 85%)`
          : theme.palette.grey[200],
        color: shouldShowColor
          ? `hsl(${hue}, 80%, 20%)`
          : theme.palette.grey[700],
        display: portraitUrl ? "block" : "flex",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: shouldShowColor
          ? `hsl(${hue}, 60%, 40%)`
          : theme.palette.grey[400],
        borderRadius: theme.shape.borderRadius,
        "&>img": {
          width: isTaller ? `${100 * scale}%` : "auto",
          height: isTaller ? "auto" : `${100 * scale}%`,
          position: "relative",
          transform: `translate(calc(${marginLeft}% + ${
            sizes[size] / 2
          }px - 4px), calc(${marginTop}% + ${sizes[size] / 2}px - 4px))`,
        },
      })}
    >
      {portraitUrl ? (
        <img
          src={portraitUrl}
          alt={name}
          onLoad={(evt) => {
            if (evt.currentTarget.width > evt.currentTarget.height) {
              setIsTaller(false);
            } else {
              setIsTaller(true);
            }
          }}
        />
      ) : name ? (
        <Typography variant={variants[size]}>{name[0]}</Typography>
      ) : (
        <Skeleton
          variant={"rectangular"}
          sx={{ flexGrow: 1, height: "100%" }}
        />
      )}
    </Box>
  );
}
