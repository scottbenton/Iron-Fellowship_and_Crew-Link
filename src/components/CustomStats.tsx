import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { useStore } from "stores/store";
import { StatComponent } from "./StatComponent";
import { useState } from "react";
import { DialogTitleWithCloseButton } from "./DialogTitleWithCloseButton";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";

export interface CustomStatsProps {
  isOnCharacterSheet?: boolean;
}

export function CustomStats(props: CustomStatsProps) {
  const { isOnCharacterSheet } = props;

  const [isCustomStatDialogOpen, setIsCustomStatDialogOpen] = useState(false);
  const [customStatName, setCustomStatName] = useState("");

  const isInCampaign = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.campaignId
  );

  const customStats = useStore((store) => store.settings.customStats);
  const stats = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.stats
  );

  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );
  const updateSettings = useStore((store) => store.settings.updateSettings);

  const updateCharacterStat = (stat: string, value: number) => {
    return updateCharacter({ [`stats.${stat}`]: value });
  };

  const handleAddCustomStat = () => {
    if (customStatName.trim()) {
      updateSettings({
        customStats: arrayUnion(customStatName) as unknown as string[],
      })
        .then(() => {
          setCustomStatName("");
          setIsCustomStatDialogOpen(false);
        })
        .catch(() => {});
    }
  };

  const handleRemoveCustomStat = (statName: string) => {
    updateSettings({
      customStats: arrayRemove(statName) as unknown as string[],
    }).catch(() => {});
  };

  return (
    <>
      {isOnCharacterSheet && stats && (
        <Box
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          px={2}
          sx={{
            mt: "0px !important",
          }}
        >
          {customStats.map((customStat) => (
            <Box key={customStat} pt={2} pr={2} position={"relative"}>
              <ButtonBase
                sx={(theme) => ({
                  position: "absolute",
                  top: theme.spacing(1),
                  right: theme.spacing(1),
                  bgcolor: theme.palette.grey[500],
                  borderRadius: "100%",
                })}
                onClick={() => handleRemoveCustomStat(customStat)}
              >
                <CloseIcon
                  sx={(theme) => ({
                    width: theme.spacing(2.5),
                    height: theme.spacing(2.5),
                  })}
                />
              </ButtonBase>
              <StatComponent
                key={customStat}
                label={customStat}
                value={stats[customStat] ?? 0}
                updateTrack={(newValue) =>
                  updateCharacterStat(customStat, newValue)
                }
              />
            </Box>
          ))}
        </Box>
      )}
      {!isOnCharacterSheet && customStats.length > 0 && (
        <Box
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          px={2}
          sx={{
            mt: "0px !important",
          }}
        >
          {customStats.map((customStat) => (
            <Chip
              label={customStat}
              onDelete={() => handleRemoveCustomStat(customStat)}
              key={customStat}
            />
          ))}
        </Box>
      )}
      {((isOnCharacterSheet && !isInCampaign) || !isOnCharacterSheet) && (
        <Box px={2}>
          <Button
            variant={"outlined"}
            color={"inherit"}
            onClick={() => setIsCustomStatDialogOpen(true)}
          >
            Add Custom Stat
          </Button>
        </Box>
      )}
      <Dialog
        open={isCustomStatDialogOpen}
        onClose={() => setIsCustomStatDialogOpen(false)}
      >
        <DialogTitleWithCloseButton
          onClose={() => setIsCustomStatDialogOpen(false)}
        >
          Custom Stats
        </DialogTitleWithCloseButton>
        <DialogContent>
          <TextField
            label={"Custom Stat Name"}
            value={customStatName}
            onChange={(evt) => setCustomStatName(evt.currentTarget.value)}
            sx={{ mt: 0.5 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCustomStatName("");
              setIsCustomStatDialogOpen(false);
            }}
            color={"inherit"}
          >
            Cancel
          </Button>
          <Button variant={"contained"} onClick={handleAddCustomStat}>
            Add Custom Stat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
