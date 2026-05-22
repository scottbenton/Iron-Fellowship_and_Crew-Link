import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { useStore } from "stores/store";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { DialogTitleWithCloseButton } from "components/shared/DialogTitleWithCloseButton";

export function Debilities() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const impacts = useStore((store) => store.rules.impacts);

  const debilityChecks = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.debilities ?? {}
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );

  const updateDebility = (debilityKey: string, active: boolean) => {
    updateCharacter({ [`debilities.${debilityKey}`]: active }).catch(() => {});
  };

  const impactsLabel = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "Debilities",
    [GAME_SYSTEMS.STARFORGED]: "Impacts",
  });

  const activeDebilities: string[] = [];
  Object.values(impacts).forEach((impactCategory) => {
    Object.keys(impactCategory.contents).forEach((debility) => {
      if (debilityChecks[debility]) {
        activeDebilities.push(impactCategory.contents[debility].label);
      }
    });
  });

  return (
    <Box mt={2} pr={2}>
      <Typography
        fontFamily={(theme) => theme.fontFamilyTitle}
        variant={"h6"}
        color={"text.secondary"}
      >
        {impactsLabel}
      </Typography>
      <Box
        borderRadius={1}
        border={(theme) => `1px solid ${theme.palette.divider}`}
        p={1}
        pl={2}
        pb={2}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant={"body2"} color={"text.secondary"}>
            Active {impactsLabel}
          </Typography>
          <IconButton size={"small"} onClick={() => setDialogOpen(true)}>
            <EditIcon />
          </IconButton>
        </Box>
        <Box>
          {activeDebilities.length > 0 ? (
            <Typography textTransform={"capitalize"}>
              {activeDebilities.join(", ")}
            </Typography>
          ) : (
            <Typography color={"text.secondary"}>
              No active {impactsLabel}
            </Typography>
          )}
        </Box>
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitleWithCloseButton onClose={() => setDialogOpen(false)}>
          Update {impactsLabel}
        </DialogTitleWithCloseButton>
        <DialogContent
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {Object.keys(impacts).map((impactCategoryKey) => (
            <FormControl
              key={impactCategoryKey}
              component="fieldset"
              variant="standard"
            >
              <FormLabel
                component="legend"
                sx={{ textTransform: "capitalize" }}
              >
                {impacts[impactCategoryKey].label}
              </FormLabel>
              <FormGroup>
                {Object.keys(impacts[impactCategoryKey].contents).map(
                  (debilityKey) => (
                    <FormControlLabel
                      key={debilityKey}
                      control={
                        <Checkbox
                          checked={debilityChecks[debilityKey] ?? false}
                          onChange={(evt, checked) =>
                            updateDebility(debilityKey, checked)
                          }
                          name={
                            impacts[impactCategoryKey].contents[debilityKey]
                              .label
                          }
                        />
                      }
                      sx={{ textTransform: "capitalize" }}
                      label={
                        impacts[impactCategoryKey].contents[debilityKey].label
                      }
                    />
                  )
                )}
              </FormGroup>
            </FormControl>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant={"contained"}
            onClick={() => setDialogOpen(false)}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
