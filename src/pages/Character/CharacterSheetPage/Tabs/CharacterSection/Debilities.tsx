import {
  Box,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { debilities } from "data/debilities";
import { useStore } from "stores/store";

export function Debilities() {
  const debilityChecks = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.debilities ?? {}
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateDebility = (debility: string, active: boolean) => {
    updateCharacter({ [`debilities.${debility}`]: active }).catch(() => {});
  };

  return (
    <>
      <SectionHeading label={"Debilities"} />
      <Box px={2}>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          {debilities.map((debilityCategory, index) => (
            <FormControl key={index} component="fieldset" variant="standard">
              <FormLabel component="legend">
                {debilityCategory.categoryName}
              </FormLabel>
              <FormGroup>
                {debilityCategory.debilities.map((debility) => (
                  <FormControlLabel
                    key={debility}
                    control={
                      <Checkbox
                        checked={debilityChecks[debility] ?? false}
                        onChange={(evt, checked) =>
                          updateDebility(debility, checked)
                        }
                        name={debility}
                      />
                    }
                    label={debility}
                  />
                ))}
              </FormGroup>
            </FormControl>
          ))}
        </Box>
      </Box>
    </>
  );
}
