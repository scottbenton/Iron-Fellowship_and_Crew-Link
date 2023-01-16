import {
  Box,
  Card,
  Checkbox,
  IconButton,
  SxProps,
  TextField,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { Track } from "../../features/character-sheet/components/Track";
import { Asset, StoredAsset } from "../../types/Asset.type";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";
import { AssetCardField } from "./AssetCardField";
import CloseIcon from "@mui/icons-material/Close";

export interface AssetCardProps {
  asset: Asset;
  storedAsset?: StoredAsset;

  readOnly?: boolean;
  hideTracks?: boolean;
  actions?: ReactNode;
  sx?: SxProps<Theme>;

  handleAbilityCheck?: (index: number, checked: boolean) => void;
  handleInputChange?: (label: string, value: string) => Promise<boolean>;
  handleTrackValueChange?: (num: number) => Promise<boolean>;
  handleMultiFieldTrackValueChange?: (value: string) => void;

  handleDeleteClick?: () => void;
}

export function AssetCard(props: AssetCardProps) {
  const {
    asset,
    storedAsset,
    readOnly,
    hideTracks,
    actions,
    sx,
    handleAbilityCheck,
    handleInputChange,
    handleTrackValueChange,
    handleMultiFieldTrackValueChange,
    handleDeleteClick,
  } = props;

  let alternateHealthMax: number | undefined;
  asset.abilities.forEach((ability) => {
    if (ability.alterTrack) {
      alternateHealthMax = ability.alterTrack.max;
    }
  });

  const companionHealthMax = alternateHealthMax ?? asset.track?.max;

  return (
    <Card
      variant={"outlined"}
      sx={{ height: "100%", display: "flex", flexDirection: "column", ...sx }}
    >
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: "white",
          py: handleDeleteClick ? 0.5 : 1,
          px: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <Typography fontFamily={(theme) => theme.fontFamilyTitle}>
          {asset.type}
        </Typography>
        {handleDeleteClick && (
          <IconButton
            onClick={() => handleDeleteClick()}
            color={"inherit"}
            sx={{ p: 0.5 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Box p={1} flexGrow={1}>
        <Typography
          variant={"h5"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {asset.name}
        </Typography>
        {asset.description && (
          <Typography variant={"body2"} color={"GrayText"}>
            {asset.description}
          </Typography>
        )}
        {asset.inputs &&
          asset.inputs.length > 0 &&
          asset.inputs?.map((field, index) => (
            <AssetCardField
              key={index}
              label={field}
              value={storedAsset?.inputs?.[field]}
              disabled={readOnly || !handleInputChange}
              onChange={(value) => {
                if (handleInputChange) {
                  return handleInputChange(field, value);
                }
                return new Promise((res, reject) =>
                  reject("HandleInputChange is undefined")
                );
              }}
            />
          ))}

        <Box>
          {asset.abilities.map((ability, index) => (
            <Box display={"flex"} alignItems={"flex-start"} mt={2} key={index}>
              <Checkbox
                checked={
                  ability.startsEnabled ??
                  storedAsset?.enabledAbilities[index] ??
                  false
                }
                disabled={
                  ability.startsEnabled || readOnly || !handleAbilityCheck
                }
                onChange={(evt) =>
                  handleAbilityCheck &&
                  handleAbilityCheck(index, evt.target.checked)
                }
              />
              <Box key={index}>
                {ability.name && (
                  <Typography display={"inline"} variant={"body2"}>
                    <b>{ability.name}: </b>
                  </Typography>
                )}
                <MarkdownRenderer markdown={ability.text} inlineParagraph />
              </Box>
            </Box>
          ))}
        </Box>
        {!hideTracks &&
          storedAsset &&
          asset.track &&
          companionHealthMax &&
          typeof storedAsset.trackValue === "number" && (
            <Track
              label={asset.track.name}
              value={storedAsset.trackValue ?? companionHealthMax}
              min={0}
              max={asset.track.startingValue ?? companionHealthMax}
              disabled={readOnly || !handleTrackValueChange}
              onChange={(newValue) =>
                new Promise((resolve, reject) => {
                  if (handleTrackValueChange) {
                    handleTrackValueChange(newValue)
                      .then(() => {
                        resolve(true);
                      })
                      .catch(() => {
                        reject("Error changing track");
                      });
                  } else {
                    reject("Track should be disabled");
                  }
                })
              }
            />
          )}
        {!hideTracks && storedAsset && asset.multiFieldTrack && (
          <Box display={"flex"} flexDirection={"column"}>
            <Typography
              component={"label"}
              variant={"subtitle1"}
              fontFamily={(theme) => theme.fontFamilyTitle}
              color={(theme) => theme.palette.text.secondary}
            >
              {asset.multiFieldTrack.name}
            </Typography>
            <ToggleButtonGroup
              exclusive
              disabled={readOnly || !handleMultiFieldTrackValueChange}
              value={storedAsset?.multiFieldTrackValue ?? ""}
              onChange={(evt, value) =>
                handleMultiFieldTrackValueChange &&
                handleMultiFieldTrackValueChange(value)
              }
              sx={{ display: "flex", width: "100%" }}
            >
              {asset.multiFieldTrack.options.map((option, index) => (
                <ToggleButton
                  key={index}
                  value={option}
                  sx={{ py: 0, px: 1, flexGrow: 1 }}
                >
                  {option}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}
      </Box>
      {actions && (
        <Box
          sx={(theme) => ({
            display: "flex",
            justifyContent: "flex-end",
            px: 1,
            pb: 1,
          })}
        >
          {actions}
        </Box>
      )}
    </Card>
  );
}
