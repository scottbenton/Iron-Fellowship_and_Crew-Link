import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useStore } from "stores/store";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";
import { includedExpansions } from "data/rulesets";

export interface ExpansionSelectorProps {
  enabledExpansionMap: Record<string, boolean>;
  toggleEnableExpansion: (expansionId: string, enabled: boolean) => void;
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
  console.debug(homebrewExpansionIds, enabledExpansionMap);

  const notFoundExpansionIds = Object.keys(enabledExpansionMap).filter(
    (key) =>
      !rulesetExpansions.some((c) => c.id === key) &&
      !homebrewExpansionIds.includes(key),
  );

  return (
    <Box>
      {officialExpansions.length > 0 && (
        <Box>
          <Typography variant={"overline"}>Official Expansions</Typography>
          <FormGroup>
            {officialExpansions.map((config) => (
              <FormControlLabel
                key={config.id}
                control={
                  <Switch
                    checked={enabledExpansionMap[config.id] ?? false}
                    onChange={(evt, checked) =>
                      toggleEnableExpansion(config.id, checked)
                    }
                  />
                }
                label={config.name}
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
              <FormControlLabel
                key={config.id}
                control={
                  <Switch
                    checked={enabledExpansionMap[config.id] ?? false}
                    onChange={(evt, checked) =>
                      toggleEnableExpansion(config.id, checked)
                    }
                  />
                }
                label={config.name}
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
                    onChange={(evt, checked) =>
                      toggleEnableExpansion(expansionId, checked)
                    }
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
                    onChange={(evt, checked) =>
                      toggleEnableExpansion(expansionId, checked)
                    }
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
