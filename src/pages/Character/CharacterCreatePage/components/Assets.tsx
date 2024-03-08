import { Control, useFieldArray } from "react-hook-form";
import { Form } from "../CharacterCreatePageContent";
import { SectionHeading } from "components/shared/SectionHeading";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { Alert, Button, Grid } from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";
import { useState } from "react";
import { AssetCardDialog } from "components/features/assets/AssetCardDialog";
import { AssetCard } from "components/features/assets/AssetCard";

export interface AssetsProps {
  control: Control<Form>;
}

export function Assets(props: AssetsProps) {
  const { control } = props;

  const defaultRuleAlertText = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]:
      "When playing with the default rules, you should choose three assets when creating your character.",
    [GAME_SYSTEMS.STARFORGED]:
      "When playing with the default rules, you should choose the Starship asset, two path assets, and one other non-deed asset when creating your character.",
  });

  const {
    fields = [],
    append,
    remove,
    update,
  } = useFieldArray({ control, name: "assets", keyName: "hook-form-id" });

  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = useState(false);

  return (
    <>
      <SectionHeading label='Assets' breakContainer />
      <Alert severity='info'>{defaultRuleAlertText}</Alert>
      {fields.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {fields.map((storedAsset, index) => (
              <Grid
                key={index}
                item
                xs={12}
                sm={6}
                lg={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <AssetCard
                  assetId={storedAsset.id}
                  storedAsset={storedAsset}
                  sx={{
                    // maxWidth: 380,
                    minHeight: 450,
                    width: "100%",
                  }}
                  handleDeleteClick={() => remove(index)}
                  handleAbilityCheck={(abilityIndex, checked) => {
                    const newAsset = { ...storedAsset };
                    newAsset.enabledAbilities[abilityIndex] = checked;
                    update(index, newAsset);
                  }}
                  handleInputChange={(label, value) => {
                    const newAsset = { ...storedAsset };
                    newAsset.inputs = { ...newAsset.inputs, [label]: value };
                    update(index, newAsset);
                    return new Promise<void>((res) => res());
                  }}
                  handleConditionCheck={(condition, checked) => {
                    const newAsset = { ...storedAsset };
                    newAsset.conditions = {
                      ...newAsset.conditions,
                      [condition]: checked,
                    };
                    update(index, newAsset);
                    return new Promise<void>((res) => res());
                  }}
                  handleCustomAssetUpdate={(asset) => {
                    update(index, { ...storedAsset, customAsset: asset });
                    return new Promise<void>((res) => res());
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <div>
            <Button
              color={"inherit"}
              variant={"outlined"}
              onClick={() => setIsAddAssetDialogOpen(true)}
              sx={{ mt: 1 }}
            >
              Add Asset
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          title={"Add Assets"}
          message={"Assets can also be added later from the Character Sheet."}
          showImage
          callToAction={
            <Button
              color={"inherit"}
              variant={"outlined"}
              onClick={() => setIsAddAssetDialogOpen(true)}
            >
              Add Asset
            </Button>
          }
        />
      )}
      <AssetCardDialog
        open={isAddAssetDialogOpen}
        handleClose={() => setIsAddAssetDialogOpen(false)}
        handleAssetSelection={(asset) => {
          append({
            ...asset,
            order:
              fields.length === 0 ? 0 : fields[fields.length - 1].order + 1,
          });
          setIsAddAssetDialogOpen(false);
        }}
        showSharedAssetWarning
      />
    </>
  );
}
