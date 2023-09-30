import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { truthMap } from "data/truths";
import { useState } from "react";
import { useStore } from "stores/store";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { Truth } from "types/World.type";

export interface IronswornWorldTruthChooserProps {
  truthId: string;
  initialTruth?: Truth;
  maxCols?: number;
}

export const getCustomTruthId = (truthId: string) => {
  return `${truthId}/custom`;
};

export function IronswornWorldTruthChooser(
  props: IronswornWorldTruthChooserProps
) {
  const { truthId, initialTruth, maxCols = 12 } = props;

  const [selectedTruth, setSelectedTruth] = useState(initialTruth?.id);
  const [customDescription, setCustomDescription] = useState(
    initialTruth?.customTruth?.Description ?? ""
  );
  const [customQuestStarter, setCustomQuestStarter] = useState(
    initialTruth?.customTruth?.["Quest starter"] ?? ""
  );

  const customTruthId = getCustomTruthId(truthId);

  const worldTruth = truthMap[truthId];

  const updateWorldTruth = useStore(
    (store) => store.worlds.currentWorld.updateCurrentWorldTruth
  );

  const selectTruthOption = (id: string) => {
    setSelectedTruth(id);

    const truth: Truth = {
      id,
    };
    if (id === customTruthId) {
      truth.customTruth = {
        $id: customTruthId,
        Description: customDescription,
        "Quest starter": customQuestStarter,
      };
    }
    updateWorldTruth(truthId, truth).catch(() => {
      setSelectedTruth(initialTruth?.id);
    });
  };

  return (
    <Grid container spacing={2}>
      {worldTruth.Options.map((option) => (
        <Grid
          item
          xs={12}
          md={6 > 12 / maxCols ? 6 : 12 / maxCols}
          lg={4 > 12 / maxCols ? 4 : 12 / maxCols}
          key={option.$id}
        >
          <Card
            variant={"outlined"}
            onClick={() => selectTruthOption(option.$id)}
            sx={(theme) => ({
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              height: "100%",
              p: 2,
              borderWidth: 2,
              cursor: "pointer",
              borderColor:
                selectedTruth === option.$id
                  ? theme.palette.primary.light
                  : undefined,
            })}
          >
            <Box sx={{ width: "100%" }}>
              <Typography>
                <Box
                  component={"span"}
                  sx={{ float: "right", width: 24, height: 24 }}
                >
                  {selectedTruth === option.$id && (
                    <CheckIcon color={"primary"} />
                  )}
                </Box>
                {option.Description}
              </Typography>
            </Box>
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.background.paperInlay,
                borderRadius: `${theme.shape.borderRadius}px`,
                px: 1,
                pb: 1,
                m: -1,
                mt: 1,
              })}
            >
              <Typography variant={"overline"}>Quest Starter</Typography>
              <Typography>{option["Quest starter"]}</Typography>
            </Box>
          </Card>
        </Grid>
      ))}
      <Grid
        item
        xs={12}
        md={6 > 12 / maxCols ? 6 : 12 / maxCols}
        lg={4 > 12 / maxCols ? 4 : 12 / maxCols}
      >
        <Card
          sx={(theme) => ({
            p: 2,
            height: "100%",
            borderWidth: 2,
            borderColor:
              selectedTruth === customTruthId
                ? theme.palette.primary.light
                : undefined,
          })}
          variant={"outlined"}
        >
          <Stack spacing={2}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant={"h6"}>Custom Truth</Typography>
              {selectedTruth === customTruthId && (
                <CheckIcon color={"primary"} />
              )}
            </Box>
            <TextField
              label={"Description"}
              minRows={3}
              fullWidth
              multiline
              value={customDescription}
              onChange={(evt) => setCustomDescription(evt.currentTarget.value)}
            />
            <TextField
              label={"Quest Starter"}
              minRows={3}
              fullWidth
              multiline
              value={customQuestStarter}
              onChange={(evt) => setCustomQuestStarter(evt.currentTarget.value)}
            />
            <Box>
              <Button
                color={"inherit"}
                variant={"outlined"}
                onClick={() => selectTruthOption(customTruthId)}
              >
                Select
              </Button>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
