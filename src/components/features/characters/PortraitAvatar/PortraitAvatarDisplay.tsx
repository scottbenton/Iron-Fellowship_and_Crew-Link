import { Box, Skeleton, Typography, TypographyVariant } from "@mui/material";
import { getHueFromString } from "functions/getHueFromString";
import { useState } from "react";
import BackgroundIcon from "@mui/icons-material/Face";

export type AvatarSizes = "small" | "medium" | "large" | "huge";

const sizes: { [key in AvatarSizes]: number } = {
  small: 40,
  medium: 60,
  large: 80,
  huge: 200,
};

const variants: { [key in AvatarSizes]: TypographyVariant } = {
  small: "h6",
  medium: "h5",
  large: "h4",
  huge: "h1",
};

export interface PortraitAvatarDisplayProps {
  size?: AvatarSizes;
  colorful?: boolean;
  rounded?: boolean;
  darkBorder?: boolean;

  portraitSettings?: {
    position: {
      x: number;
      y: number;
    };
    scale: number;
  };
  characterId?: string;
  portraitUrl?: string;
  name?: string;
  loading?: boolean;
}

export function PortraitAvatarDisplay(props: PortraitAvatarDisplayProps) {
  const {
    size = "medium",
    colorful,
    rounded,
    darkBorder,
    portraitSettings,
    characterId,
    portraitUrl,
    name,
    loading,
  } = props;

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

  const borderWidth = size === "huge" && darkBorder ? 12 : 2;

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
        borderWidth,
        borderStyle: "solid",
        borderColor: shouldShowColor
          ? `hsl(${hue}, 60%, 40%)`
          : darkBorder
          ? theme.palette.grey[700]
          : theme.palette.grey[400],
        borderRadius: rounded ? "100%" : `${theme.shape.borderRadius}px`,
        "&>img": {
          width: isTaller ? `${100 * scale}%` : "auto",
          height: isTaller ? "auto" : `${100 * scale}%`,
          position: "relative",
          transform: `translate(calc(${marginLeft}% + ${
            sizes[size] / 2
          }px - ${borderWidth}px), calc(${marginTop}% + ${
            sizes[size] / 2
          }px - ${borderWidth}px))`,
        },
        flexShrink: 0,
      })}
    >
      {portraitUrl ? (
        <img
          src={portraitUrl}
          onLoad={(evt) => {
            if (evt.currentTarget.width > evt.currentTarget.height) {
              setIsTaller(false);
            } else {
              setIsTaller(true);
            }
          }}
          alt={"Character Portrait"}
        />
      ) : !loading ? (
        name ? (
          <Typography
            variant={variants[size]}
            fontWeight={size === "huge" ? 600 : undefined}
          >
            {name[0]}
          </Typography>
        ) : (
          <BackgroundIcon />
        )
      ) : (
        <Skeleton
          variant={"rectangular"}
          sx={{ flexGrow: 1, height: "100%" }}
        />
      )}
    </Box>
  );
}
