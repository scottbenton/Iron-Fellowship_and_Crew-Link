import { Datasworn } from "@datasworn/core";
import { Box, Card, IconButton, Tooltip } from "@mui/material";
import { AssetAbilities } from "components/features/assets/AssetCard/AssetAbilities";
import { AssetControls } from "components/features/assets/AssetCard/AssetControls";
import { AssetHeader } from "components/features/assets/AssetCard/AssetHeader";
import { AssetNameAndDescription } from "components/features/assets/AssetCard/AssetNameAndDescription";
import { AssetOptions } from "components/features/assets/AssetCard/AssetOptions";
import { convertIdPart } from "functions/dataswornIdEncoder";
import { HomebrewAssetDocument } from "api-calls/homebrew/assets/assets/_homebrewAssets.type";
import EditIcon from "@mui/icons-material/Edit";
import MoveIcon from "@mui/icons-material/DriveFileMove";

export interface AssetPreviewCardProps {
  storedAsset: HomebrewAssetDocument;
  collectionName: string;
  handleDeleteAsset: () => void;
  handleEditAsset: () => void;
  handleMoveAsset: () => void;
  isEditor: boolean;
}

export function AssetPreviewCard(props: AssetPreviewCardProps) {
  const {
    storedAsset,
    collectionName,
    handleDeleteAsset,
    handleEditAsset,
    handleMoveAsset,
    isEditor,
  } = props;

  const { label, requirement, abilities, options, controls } = storedAsset;

  const dataswornAbilities: Datasworn.AssetAbility[] = abilities.map(
    (ability, index) => ({
      _id: index + "",
      text: ability.text,
      name: ability.name,
      enabled: ability.defaultEnabled ?? false,
    })
  );

  const dataswornOptions: Record<string, Datasworn.AssetOptionField> = {};
  options?.forEach((option) => {
    let optionId: string;

    try {
      optionId = convertIdPart(option.label);
    } catch (e) {
      return;
    }
    if (option.type === "text") {
      dataswornOptions[optionId] = {
        label: option.label,
        field_type: "text",
        value: "",
      };
    } else {
      const choices: Record<string, Datasworn.SelectEnhancementFieldChoice> =
        {};

      (option.options ?? []).forEach((optionChoice) => {
        choices[optionChoice] = {
          label: optionChoice,
          choice_type: "choice",
        };
      });

      dataswornOptions[optionId] = {
        label: option.label,
        field_type: "select_enhancement",
        value: "",
        choices,
      };
    }
  });

  const dataswornControls: Record<string, Datasworn.AssetControlField> = {};
  controls?.forEach((control) => {
    let controlId: string;

    try {
      controlId = convertIdPart(control.label);
    } catch (e) {
      return;
    }
    if (control.type === "checkbox") {
      dataswornControls[controlId] = {
        field_type: "checkbox",
        label: control.label,
        value: false,
        is_impact: false,
        disables_asset: false,
      };
    } else if (control.type === "select") {
      const choices: Record<string, Datasworn.SelectEnhancementFieldChoice> =
        {};

      (control.options ?? []).forEach((optionChoice) => {
        choices[optionChoice] = {
          label: optionChoice,
          choice_type: "choice",
        };
      });

      dataswornControls[controlId] = {
        label: control.label,
        field_type: "select_enhancement",
        value: "",
        choices,
      };
    } else if (control.type === "conditionMeter") {
      dataswornControls[controlId] = {
        label: control.label,
        field_type: "condition_meter",
        value: control.max,
        max: control.max,
        min: control.min,
        rollable: true,
        controls: {},
      };
    }
  });

  const asset: Datasworn.Asset = {
    _id: "",
    type: "asset",
    name: label,
    count_as_impact: false,
    shared: false,
    _source: { title: "", authors: [], date: "", url: "", license: "" },

    requirement: requirement,
    category: collectionName,
    abilities: dataswornAbilities,
    options: dataswornOptions,
    controls: dataswornControls,
  };

  return (
    <Card
      variant={"outlined"}
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderWidth: 0,
      }}
    >
      <AssetHeader
        asset={asset}
        onAssetRemove={isEditor ? handleDeleteAsset : undefined}
        actions={
          isEditor && (
            <>
              <Tooltip title={"Move asset to another collection"}>
                <IconButton onClick={handleMoveAsset} color={"inherit"}>
                  <MoveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Edit Asset"}>
                <IconButton onClick={handleEditAsset} color={"inherit"}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </>
          )
        }
      />
      <Box
        flexGrow={1}
        display={"flex"}
        flexDirection={"column"}
        p={1}
        border={(theme) => `1px solid ${theme.palette.divider}`}
        sx={(theme) => ({
          borderBottomLeftRadius: theme.shape.borderRadius,
          borderBottomRightRadius: theme.shape.borderRadius,
        })}
      >
        <AssetNameAndDescription asset={asset} />
        <AssetOptions
          options={asset.options ?? {}}
          onAssetOptionChange={() => {}}
        />
        <AssetAbilities asset={asset} />
        <AssetControls controls={asset.controls} onControlChange={() => {}} />
      </Box>
    </Card>
  );
}
