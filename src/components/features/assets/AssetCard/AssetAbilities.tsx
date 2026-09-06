import { Datasworn } from "@datasworn-community/core";
import { Box, Checkbox, Typography } from "@mui/material";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { AssetDocument } from "api-calls/assets/_asset.type";

export interface AssetAbilitiesProps {
  asset: Datasworn.Asset;
  storedAsset?: AssetDocument;
  onAbilityToggle?: (abilityIndex: number, checked: boolean) => void;
}

export function AssetAbilities(props: AssetAbilitiesProps) {
  const { asset, storedAsset, onAbilityToggle } = props;

  return (
    <Box flexGrow={1}>
      {asset.abilities.map((ability, index) => (
        <Box display={"flex"} alignItems={"flex-start"} mt={2} key={index}>
          <Checkbox
            checked={
              (ability.enabled || storedAsset?.enabledAbilities[index]) ?? false
            }
            disabled={ability.enabled || !onAbilityToggle}
            onChange={(evt) =>
              onAbilityToggle && onAbilityToggle(index, evt.target.checked)
            }
            sx={{ p: 0.5 }}
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
  );
}
