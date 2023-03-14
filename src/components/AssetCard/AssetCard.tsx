import {
  Box,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  SxProps,
  TextField,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Track } from "../Track";
import { StoredAsset } from "../../types/Asset.type";
import {
  Asset,
  AssetAlterPropertiesConditionMeter,
  ConditionMeter,
} from "dataforged";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";
import { AssetCardField } from "./AssetCardField";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { CreateCustomAsset } from "../AssetCardDialog/CreateCustomAsset";
import { useSnackbar } from "../../hooks/useSnackbar";
import { assetMap, assetTypeLabels } from "data/assets";

export interface AssetCardProps {
  assetId: string;
  storedAsset?: StoredAsset;

  readOnly?: boolean;
  hideTracks?: boolean;
  actions?: ReactNode;
  sx?: SxProps<Theme>;

  handleAbilityCheck?: (index: number, checked: boolean) => void;
  handleInputChange?: (label: string, value: string) => Promise<boolean>;
  handleTrackValueChange?: (num: number) => Promise<boolean>;

  handleCustomAssetUpdate?: (asset: Asset) => Promise<boolean>;

  handleDeleteClick?: () => void;
}

export function AssetCard(props: AssetCardProps) {
  const {
    assetId,
    storedAsset,
    readOnly,
    hideTracks,
    actions,
    sx,
    handleAbilityCheck,
    handleInputChange,
    handleTrackValueChange,
    handleDeleteClick,
    handleCustomAssetUpdate,
  } = props;

  const asset = storedAsset?.customAsset ?? assetMap[assetId];

  const { error } = useSnackbar();

  const [editCustomAssetDialogOpen, setEditCustomAssetDialogOpen] =
    useState<boolean>(false);

  let alternateConditionMeterProperties:
    | AssetAlterPropertiesConditionMeter
    | undefined;

  asset.Abilities.forEach((ability) => {
    if (ability["Alter properties"]) {
      alternateConditionMeterProperties =
        ability["Alter properties"]?.["Condition meter"];
    }
  });

  const conditionMeter = asset["Condition meter"]
    ? { ...asset["Condition meter"], ...alternateConditionMeterProperties }
    : undefined;
  const isCustom = asset.$id.startsWith("ironsworn/assets/custom/");

  const onCustomAssetUpdate = (asset: Asset) => {
    if (handleCustomAssetUpdate) {
      handleCustomAssetUpdate(asset)
        .then(() => {
          setEditCustomAssetDialogOpen(false);
        })
        .catch((e) => {
          error("Error updating custom asset.");
        });
    }
  };

  return (
    <>
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
            {isCustom && "Custom"} {assetTypeLabels[asset["Asset type"]]}
          </Typography>
          <Box>
            {isCustom && handleCustomAssetUpdate && (
              <IconButton
                onClick={() => setEditCustomAssetDialogOpen(true)}
                color={"inherit"}
                sx={{ p: 0.5 }}
              >
                <EditIcon />
              </IconButton>
            )}
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
        </Box>
        <Box p={1} flexGrow={1} display={"flex"} flexDirection={"column"}>
          <Typography
            variant={"h5"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {asset.Title.Standard}
          </Typography>
          {asset.Requirement && (
            <MarkdownRenderer markdown={asset.Requirement} />
          )}
          {Object.values(asset.Inputs ?? {}).map((field, index) => (
            <AssetCardField
              key={field.$id}
              field={field}
              value={storedAsset?.inputs?.[field.$id]}
              onChange={(value) => {
                if (handleInputChange) {
                  return handleInputChange(field.$id, value);
                }
                return new Promise((res, reject) =>
                  reject("HandleInputChange is undefined")
                );
              }}
              disabled={readOnly || !handleInputChange}
            />
          ))}
          <Box flexGrow={1}>
            {asset.Abilities.map((ability, index) => (
              <Box
                display={"flex"}
                alignItems={"flex-start"}
                mt={2}
                key={index}
              >
                <Checkbox
                  checked={
                    ability.Enabled ??
                    storedAsset?.enabledAbilities[index] ??
                    false
                  }
                  disabled={ability.Enabled || readOnly || !handleAbilityCheck}
                  onChange={(evt) =>
                    handleAbilityCheck &&
                    handleAbilityCheck(index, evt.target.checked)
                  }
                  sx={{ p: 0.5 }}
                />
                <Box key={index}>
                  {ability.Label && (
                    <Typography display={"inline"} variant={"body2"}>
                      <b>{ability.Label}: </b>
                    </Typography>
                  )}
                  <MarkdownRenderer markdown={ability.Text} inlineParagraph />
                </Box>
              </Box>
            ))}
          </Box>

          {!hideTracks &&
            storedAsset &&
            conditionMeter &&
            typeof storedAsset.trackValue === "number" && (
              <Track
                sx={{ mt: 1 }}
                label={conditionMeter.Label}
                value={storedAsset.trackValue ?? conditionMeter.Max}
                min={0}
                max={conditionMeter.Value ?? conditionMeter.Max}
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
      <Dialog
        open={editCustomAssetDialogOpen}
        onClose={() => setEditCustomAssetDialogOpen(false)}
        maxWidth={"xs"}
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Edit Custom Asset
          <Box>
            <IconButton onClick={() => setEditCustomAssetDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* <CreateCustomAsset
            handleSelect={onCustomAssetUpdate}
            startingAsset={asset}
          /> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
