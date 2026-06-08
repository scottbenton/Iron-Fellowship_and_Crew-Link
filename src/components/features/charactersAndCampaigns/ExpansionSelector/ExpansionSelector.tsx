import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useStore } from "stores/store";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { EmptyState } from "components/shared/EmptyState";
import { IExpansionConfig, includedExpansions } from "data/rulesets";
import { buildExpansionChanges } from "./expansionCascade";

export { buildExpansionChanges } from "./expansionCascade";

export interface ExpansionSelectorProps {
  enabledExpansionMap: Record<string, boolean>;
  toggleEnableExpansion: (changes: Record<string, boolean>) => void;
}

function ExpansionRow({
  config,
  checked,
  onChange,
}: {
  config: IExpansionConfig;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const label =
    config.id === "lodestar" ? (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {config.name}
        <Tooltip title="Requires Ironsworn: Delve">
          <InfoIcon fontSize="small" color="action" />
        </Tooltip>
      </Box>
    ) : (
      config.name
    );

  return (
    <FormControlLabel
      control={
        <Switch checked={checked} onChange={(_, c) => onChange(c)} />
      }
      label={label}
    />
  );
}

export function ExpansionSelector(props: ExpansionSelectorProps) {
  const { enabledExpansionMap, toggleEnableExpansion } = props;
  const activeRulesetId = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "classic",
    [GAME_SYSTEMS.STARFORGED]: "starforged",
  });

  const homebrewExpansionMap = useStore((store) => store.homebrew.collections);
  const sortedExpansionIds = useStore(
    (store) => store.homebrew.sortedHomebrewCollectionIds,
  );

  const rulesetExpansions = Object.values(
    includedExpansions[activeRulesetId] ?? {},
  );

  const officialExpansions = rulesetExpansions.filter((c) => !c.isHomebrew);
  const thirdPartyExpansions = rulesetExpansions.filter((c) => c.isHomebrew);

  const homebrewExpansionIds = sortedExpansionIds.filter(
    (expansionId) =>
      homebrewExpansionMap[expansionId]?.base?.rulesetId === activeRulesetId,
  );

  const notFoundExpansionIds = Object.keys(enabledExpansionMap).filter(
    (key) =>
      !rulesetExpansions.some((c) => c.id === key) &&
      !homebrewExpansionIds.includes(key),
  );

  const handleToggle = (expansionId: string, checked: boolean) => {
    toggleEnableExpansion(buildExpansionChanges(expansionId, checked));
  };

  return (
    <Box>
      {officialExpansions.length > 0 && (
        <Box>
          <Typography variant={"overline"}>Official Expansions</Typography>
          <FormGroup>
            {officialExpansions.map((config) => (
              <ExpansionRow
                key={config.id}
                config={config}
                checked={enabledExpansionMap[config.id] ?? false}
                onChange={(checked) => handleToggle(config.id, checked)}
              />
            ))}
          </FormGroup>
        </Box>
      )}
      {thirdPartyExpansions.length > 0 && (
        <Box mt={officialExpansions.length > 0 ? 4 : 0}>
          <Typography variant={"overline"}>Third-Party Expansions</Typography>
          <FormGroup>
            {thirdPartyExpansions.map((config) => (
              <ExpansionRow
                key={config.id}
                config={config}
                checked={enabledExpansionMap[config.id] ?? false}
                onChange={(checked) => handleToggle(config.id, checked)}
              />
            ))}
          </FormGroup>
        </Box>
      )}
      <Box
        mt={
          officialExpansions.length > 0 || thirdPartyExpansions.length > 0
            ? 4
            : 0
        }
      >
        <Typography variant={"overline"}>Homebrew Expansions</Typography>
        {homebrewExpansionIds.length > 0 ? (
          <FormGroup>
            {homebrewExpansionIds.map((expansionId) => (
              <FormControlLabel
                key={expansionId}
                control={
                  <Switch
                    checked={enabledExpansionMap[expansionId] ?? false}
                    onChange={(_, checked) => handleToggle(expansionId, checked)}
                  />
                }
                label={
                  homebrewExpansionMap[expansionId]?.base?.title ?? "Loading"
                }
              />
            ))}
            {notFoundExpansionIds.map((expansionId) => (
              <FormControlLabel
                key={expansionId}
                control={
                  <Switch
                    checked={enabledExpansionMap[expansionId] ?? false}
                    onChange={(_, checked) => handleToggle(expansionId, checked)}
                  />
                }
                label={
                  homebrewExpansionMap[expansionId]?.base?.title ??
                  "Deleted Homebrew Expansion"
                }
              />
            ))}
          </FormGroup>
        ) : (
          <EmptyState leftAlign message={"No homebrew expansions found"} />
        )}
      </Box>
    </Box>
  );
}
