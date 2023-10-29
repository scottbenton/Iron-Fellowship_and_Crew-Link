import {
  Box,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { Track } from "components/features/Track";
import { StoredAsset } from "types/Asset.type";
import { Asset, AssetAlterPropertiesConditionMeter } from "dataforged";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { AssetCardField } from "./AssetCardField";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { CreateCustomAsset } from "../AssetCardDialog/CreateCustomAsset";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { assetMap, assetTypeLabels } from "data/assets";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import GroupIcon from "@mui/icons-material/Group";
import { getIsLocalEnvironment } from "functions/getGameSystem";
import { FieldType } from "./FieldType";

export interface AssetCardProps {
  assetId: string;
  storedAsset?: StoredAsset;

  showSharedIcon?: boolean;

  readOnly?: boolean;
  hideTracks?: boolean;
  actions?: ReactNode;
  sx?: SxProps<Theme>;

  handleAbilityCheck?: (index: number, checked: boolean) => void;
  handleInputChange?: (label: string, value: string) => Promise<void>;
  handleTrackValueChange?: (num: number) => Promise<void>;
  handleConditionCheck?: (condition: string, checked: boolean) => Promise<void>;

  handleCustomAssetUpdate?: (asset: Asset) => Promise<void>;

  handleDeleteClick?: () => void;
}

export function AssetCard(props: AssetCardProps) {
  const {
    assetId,
    storedAsset,
    readOnly,
    hideTracks,
    actions,
    showSharedIcon,
    sx,
    handleAbilityCheck,
    handleInputChange,
    handleTrackValueChange,
    handleConditionCheck,
    handleDeleteClick,
    handleCustomAssetUpdate,
  } = props;

  const isLocal = getIsLocalEnvironment();

  const { error } = useSnackbar();

  const [editCustomAssetDialogOpen, setEditCustomAssetDialogOpen] =
    useState<boolean>(false);
  const asset = storedAsset?.customAsset ?? assetMap[assetId];
  const isCustom = !!storedAsset?.customAsset;

  const isShared = asset.Usage.Shared;

  if (!asset) return null;

  const abilityInputs: FieldType[] = [];

  let alternateConditionMeterProperties:
    | AssetAlterPropertiesConditionMeter
    | undefined;

  asset.Abilities.forEach((ability, index) => {
    if (ability["Alter properties"]) {
      alternateConditionMeterProperties =
        ability["Alter properties"]?.["Condition meter"];
    }
    if (
      ((ability.Enabled || storedAsset?.enabledAbilities[index]) ?? false) &&
      Object.values(ability.Inputs ?? {}).length > 0
    ) {
      Object.values(ability.Inputs ?? {}).forEach((input) => {
        abilityInputs.push(input);
      });
    }
  });

  const conditionMeter = asset["Condition meter"]
    ? { ...asset["Condition meter"], ...alternateConditionMeterProperties }
    : undefined;

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
            backgroundColor: theme.palette.darkGrey.light,
            color: theme.palette.darkGrey.contrastText,
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
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography
              variant={"h5"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              {asset.Title.Standard}
            </Typography>
            {isShared && showSharedIcon && (
              <Tooltip title={"Shared"}>
                <GroupIcon color={"primary"} />
              </Tooltip>
            )}
          </Box>
          {isLocal && <Typography variant={"caption"}>{asset.$id}</Typography>}
          {asset.Requirement && (
            <MarkdownRenderer markdown={asset.Requirement} />
          )}
          {Object.values(asset.Inputs ?? {}).map((field, index) => (
            <AssetCardField
              key={field.$id}
              field={field}
              value={storedAsset?.inputs?.[encodeDataswornId(field.$id)]}
              onChange={(value) => {
                if (handleInputChange) {
                  return handleInputChange(encodeDataswornId(field.$id), value);
                }
                return new Promise((res, reject) =>
                  reject("HandleInputChange is undefined")
                );
              }}
              disabled={readOnly || !handleInputChange}
            />
          ))}
          {abilityInputs.map((field, index) => (
            <AssetCardField
              key={field.$id}
              field={field}
              value={storedAsset?.inputs?.[encodeDataswornId(field.$id)]}
              onChange={(value) => {
                if (handleInputChange) {
                  return handleInputChange(encodeDataswornId(field.$id), value);
                }
                return new Promise((res, reject) =>
                  reject("handleInputChange is undefined")
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
                    (ability.Enabled || storedAsset?.enabledAbilities[index]) ??
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
                  <MarkdownRenderer
                    markdown={ability.Text.replaceAll(
                      "ironsworn/moves/adventure/aid_your_ally",
                      "ironsworn/moves/relationship/aid_your_ally"
                    )}
                    inlineParagraph
                  />
                </Box>
              </Box>
            ))}
          </Box>
          {!hideTracks &&
            storedAsset &&
            conditionMeter &&
            conditionMeter.Conditions.length > 0 && (
              <Box display={"flex"} flexWrap={"wrap"}>
                {conditionMeter.Conditions.map((condition, index) => (
                  <FormControlLabel
                    key={condition}
                    disabled={!handleConditionCheck}
                    control={
                      <Checkbox
                        checked={
                          (storedAsset.conditions ?? {})[condition] ?? false
                        }
                        onChange={(evt, value) =>
                          handleConditionCheck &&
                          handleConditionCheck(condition, value).catch(() => {})
                        }
                      />
                    }
                    label={condition}
                    sx={{ textTransform: "capitalize", marginRight: 3 }}
                  />
                ))}
              </Box>
            )}
          {!hideTracks &&
            storedAsset &&
            conditionMeter &&
            typeof storedAsset.trackValue === "number" && (
              <Track
                sx={{ mt: 1 }}
                label={conditionMeter.Label.replace(
                  "companion health",
                  "health"
                )}
                value={storedAsset.trackValue ?? conditionMeter.Max}
                min={conditionMeter.Min}
                max={conditionMeter.Max}
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
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              px: 1,
              pb: 1,
            }}
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
          <CreateCustomAsset
            handleSelect={onCustomAssetUpdate}
            startingAsset={asset}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
