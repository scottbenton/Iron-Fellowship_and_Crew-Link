import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useStore } from "stores/store";
import { Truth } from "api-calls/world/_world.type";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { Datasworn } from "@datasworn-community/core";
import { TruthCard } from "./TruthCard";
import { CUSTOM_TRUTH_INDEX } from "./customTruthIndex";

export interface TruthChooserProps {
  truthKey: string;
  truth: Datasworn.Truth;
  maxCols?: number;
}

export function TruthChooser(props: TruthChooserProps) {
  const { truthKey, truth, maxCols = 12 } = props;

  const storedTruth: Truth | undefined = useStore(
    (store) =>
      (store.worlds.currentWorld.currentWorld?.newTruths ?? {})[truthKey]
  );

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(
    storedTruth?.selectedTruthOptionIndex
  );
  const [selectedSubOptionIndex, setSelectedSubOptionIndex] = useState<
    number | null
  >(storedTruth?.selectedSubItemIndex ?? null);

  const [customDescription, setCustomDescription] = useState(
    storedTruth?.customTruth?.description ?? ""
  );
  const [customQuestStarter, setCustomQuestStarter] = useState(
    storedTruth?.customTruth?.questStarter ?? ""
  );

  const updateWorldTruth = useStore(
    (store) => store.worlds.currentWorld.updateCurrentWorldTruth
  );
  const selectTruthOption = (truthOptionIndex: number) => {
    setSelectedOptionIndex(truthOptionIndex);
    setSelectedSubOptionIndex(null);

    const updatedTruth: Truth = {
      selectedTruthOptionIndex: truthOptionIndex,
      selectedSubItemIndex: null,
    };
    if (truthOptionIndex === CUSTOM_TRUTH_INDEX) {
      updatedTruth.customTruth = {
        description: customDescription,
        questStarter: customQuestStarter,
      };
    }

    updateWorldTruth(truthKey, updatedTruth).catch(() => {
      setSelectedOptionIndex(storedTruth?.selectedTruthOptionIndex);
      setSelectedSubOptionIndex(storedTruth?.selectedSubItemIndex ?? null);
    });
  };

  const selectTruthSubOption = (
    truthOptionIndex: number,
    truthSubOptionIndex: number
  ) => {
    setSelectedOptionIndex(truthOptionIndex);
    setSelectedSubOptionIndex(truthSubOptionIndex);
    updateWorldTruth(truthKey, {
      selectedTruthOptionIndex: truthOptionIndex,
      selectedSubItemIndex: truthSubOptionIndex,
    }).catch(() => {
      setSelectedOptionIndex(storedTruth?.selectedTruthOptionIndex);
      setSelectedSubOptionIndex(storedTruth?.selectedSubItemIndex ?? null);
    });
  };

  return (
    <Grid container spacing={2}>
      {truth.options.map((truthOption, index) => (
        <Grid
          item
          xs={12}
          md={6 > 12 / maxCols ? 6 : 12 / maxCols}
          lg={4 > 12 / maxCols ? 4 : 12 / maxCols}
          key={index}
        >
          <TruthCard
            truthKey={truthKey}
            truth={truth}
            truthOption={truthOption}
            hideHeader
            fullHeight
            selected={index === selectedOptionIndex}
            onSelect={() => selectTruthOption(index)}
            selectedSubItemIndex={selectedSubOptionIndex}
            onSelectSubItem={(subOptionIndex) =>
              selectTruthSubOption(index, subOptionIndex)
            }
            canEdit
          />
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
            borderColor:
              selectedOptionIndex === CUSTOM_TRUTH_INDEX
                ? theme.palette.primary.light
                : undefined,
          })}
          variant={"outlined"}
        >
          <Stack spacing={2}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant={"h6"}>Custom Truth</Typography>
              {selectedOptionIndex === CUSTOM_TRUTH_INDEX && (
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
                onClick={() => selectTruthOption(CUSTOM_TRUTH_INDEX)}
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
