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
import {
  defaultExpansions,
  thirdPartyExpansions as thirdPartyExpansionMap,
} from "data/rulesets";

const expansions = Object.values(defaultExpansions);
const thirdPartyExpansions = Object.values(thirdPartyExpansionMap);

export interface ExpansionSelectorProps {
  enabledExpansionMap: Record<string, boolean>;
  toggleEnableExpansion: (expansionId: string, enabled: boolean) => void;
}

export function ExpansionSelector(props: ExpansionSelectorProps) {
  const { enabledExpansionMap, toggleEnableExpansion } = props;
  const baseRuleset = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "classic",
    [GAME_SYSTEMS.STARFORGED]: "starforged",
  });

  const homebrewExpansionMap = useStore((store) => store.homebrew.collections);
  const sortedExpansionIds = useStore(
    (store) => store.homebrew.sortedHomebrewCollectionIds,
  );

  const expansionIds = sortedExpansionIds.filter(
    (expansionId) =>
      homebrewExpansionMap[expansionId]?.base?.rulesetId === baseRuleset,
  );
  console.debug(expansionIds, enabledExpansionMap);

  const notFoundExpansionIds = Object.keys(enabledExpansionMap).filter(
    (key) =>
      !expansions.some((expansion) => expansion._id === key) &&
      !thirdPartyExpansions.some((expansion) => expansion._id === key) &&
      !expansionIds.includes(key),
  );

  return (
    <Box>
      {expansions.length > 0 && (
        <Box>
          <Typography variant={"overline"}>Official Expansions</Typography>
          <FormGroup>
            {expansions.map((expansion) => (
              <FormControlLabel
                key={expansion._id}
                control={
                  <Switch
                    checked={enabledExpansionMap[expansion._id] ?? false}
                    onChange={(evt, checked) =>
                      toggleEnableExpansion(expansion._id, checked)
                    }
                  />
                }
                label={expansion.title ?? "Unnamed Expansion"}
              />
            ))}
          </FormGroup>
        </Box>
      )}
      {thirdPartyExpansions.length > 0 && (
        <Box mt={expansions.length > 0 ? 4 : 0}>
          <Typography variant={"overline"}>Third-Party Expansions</Typography>
          <FormGroup>
            {thirdPartyExpansions.map((expansion) => (
              <FormControlLabel
                key={expansion._id}
                control={
                  <Switch
                    checked={enabledExpansionMap[expansion._id] ?? false}
                    onChange={(evt, checked) =>
                      toggleEnableExpansion(expansion._id, checked)
                    }
                  />
                }
                label={expansion.title ?? "Unnamed Expansion"}
              />
            ))}
          </FormGroup>
        </Box>
      )}
      <Box
        mt={expansions.length > 0 || thirdPartyExpansions.length > 0 ? 4 : 0}
      >
        <Typography variant={"overline"}>Homebrew Expansions</Typography>
        {expansionIds.length > 0 ? (
          <FormGroup>
            {expansionIds.map((expansionId) => (
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
