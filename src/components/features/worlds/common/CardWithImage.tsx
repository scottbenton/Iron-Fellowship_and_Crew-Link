import { Box, Card, CardActionArea, Typography } from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import HiddenIcon from "@mui/icons-material/VisibilityOff";
import { GameIcon } from "components/shared/GameIcons/GameIcon";
import { RequiredIconDefinition } from "types/Icon.type";
import { ReactNode } from "react";

export interface CardWithImageProps {
  name: string;
  type?: string;
  secondaryText?: string | ReactNode;

  imageUrl?: string;
  icon?: RequiredIconDefinition;

  showHiddenTag?: boolean;
  handleClick: () => void;
}

export function CardWithImage(props: CardWithImageProps) {
  const {
    name,
    secondaryText,
    type,
    imageUrl,
    icon,
    showHiddenTag,
    handleClick,
  } = props;

  return (
    <Card variant={"outlined"} sx={{ overflow: "visible" }}>
      <CardActionArea
        onClick={handleClick}
        sx={(theme) => ({
          p: 2,
          "& .card-with-image-portrait": {
            marginTop: -3,
            marginLeft: -1,
            transitionProperty: "margin-top margin-bottom",
            transitionDuration: `${theme.transitions.duration.shorter}ms`,
            transitionTimingFunction: theme.transitions.easing.easeInOut,
          },
          "&:hover, &:focus-visible": {
            "& .card-with-image-portrait": {
              marginTop: -1.5,
              marginBottom: -1.5,
            },
          },
        })}
      >
        <Box display={"flex"} alignItems={"start"}>
          <Box
            className={"card-with-image-portrait"}
            sx={(theme) => ({
              marginRight: 2,
              width: 80,
              height: 80,
              flexShrink: 0,
              borderRadius: `${theme.shape.borderRadius}px`,
              backgroundColor: theme.palette.background.mapBackground,
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: "center top",
              backgroundSize: "cover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: theme.shadows[3],
            })}
          >
            {!imageUrl && icon && (
              <GameIcon
                iconName={icon.key}
                iconColor={icon.color}
                sx={{ fontSize: 48 }}
              />
            )}
            {!imageUrl && !icon && (
              <PhotoIcon
                sx={(theme) => ({
                  color: theme.palette.grey[400],
                })}
              />
            )}
          </Box>
          <Box
            display={"flex"}
            alignItems={"flex-start"}
            justifyContent={"space-between"}
            flexGrow={1}
            overflow={"hidden"}
          >
            <Box overflow={"hidden"}>
              {type && (
                <Typography
                  whiteSpace={"nowrap"}
                  overflow={"hidden"}
                  variant={"overline"}
                  textOverflow={"ellipsis"}
                >
                  {type}
                </Typography>
              )}
              <Typography
                whiteSpace={"nowrap"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
              >
                {name}
              </Typography>
              {typeof secondaryText === "string" ? (
                <Typography
                  whiteSpace={"nowrap"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  variant={"body2"}
                  color={"textSecondary"}
                >
                  {secondaryText}
                </Typography>
              ) : (
                secondaryText
              )}
            </Box>
            {showHiddenTag && <HiddenIcon color={"action"} />}
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
