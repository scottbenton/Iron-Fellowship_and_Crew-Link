import { Datasworn } from "@datasworn/core";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import delve from "@datasworn/ironsworn-classic-delve/json/delve.json";
import { useStore } from "stores/store";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import { EmptyState } from "components/shared/EmptyState";

const defaultExpansions: GameSystemChooser<Datasworn.Expansion[]> = {
  [GAME_SYSTEMS.IRONSWORN]: [delve as unknown as Datasworn.Expansion],
  [GAME_SYSTEMS.STARFORGED]: [],
};

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

  const officialExpansions = useGameSystemValue(defaultExpansions);

  const homebrewExpansionMap = useStore((store) => store.homebrew.collections);

  const expansionIds = Object.keys(homebrewExpansionMap)
    .filter(
      (expansionId) =>
        homebrewExpansionMap[expansionId]?.base?.rulesetId === baseRuleset
    )
    .sort((k1, k2) =>
      homebrewExpansionMap[k1]?.base?.title?.localeCompare(
        homebrewExpansionMap[k2]?.base?.title
      )
    );

  return (
    <Box>
      {officialExpansions.length > 0 && (
        <Box>
          <Typography variant={"overline"}>Official Expansions</Typography>
          <FormGroup>
            {officialExpansions.map((expansion) => (
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
      <Box mt={officialExpansions.length > 0 ? 4 : 0}>
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
                  homebrewExpansionMap[expansionId].base?.title ?? "Loading"
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
