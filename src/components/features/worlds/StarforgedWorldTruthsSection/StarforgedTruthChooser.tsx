import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TruthStarforged } from "dataforged";
import { StarforgedTruthCard } from "./StarforgedTruthCard";
import { useStore } from "stores/store";
import { Truth } from "types/World.type";
import { useState } from "react";
import { getCustomTruthId } from "../IronswornWorldTruthsSection/IronswornWorldTruthChooser";
import CheckIcon from "@mui/icons-material/CheckCircle";

export interface StarforgedTruthChooserProps {
  truth: TruthStarforged;
  maxCols?: number;
}

export function StarforgedTruthChooser(props: StarforgedTruthChooserProps) {
  const { truth, maxCols = 12 } = props;

  const customTruthId = getCustomTruthId(truth.$id);

  const storedTruth: Truth | undefined = useStore(
    (store) => (store.worlds.currentWorld.currentWorld?.truths ?? {})[truth.$id]
  );
  const [selectedOptionId, setSelectedOptionId] = useState(storedTruth?.id);
  const [selectedSubOptionId, setSelectedSubOptionId] = useState<string | null>(
    storedTruth?.selectedSubItemId ?? null
  );

  const [customDescription, setCustomDescription] = useState(
    storedTruth?.customTruth?.Description ?? ""
  );
  const [customQuestStarter, setCustomQuestStarter] = useState(
    storedTruth?.customTruth?.["Quest starter"] ?? ""
  );

  const updateWorldTruth = useStore(
    (store) => store.worlds.currentWorld.updateCurrentWorldTruth
  );
  const selectTruthOption = (truthOptionId: string) => {
    setSelectedOptionId(truthOptionId);
    setSelectedSubOptionId(null);

    const updatedTruth: Truth = {
      id: truthOptionId,
      selectedSubItemId: null,
    };
    if (truthOptionId === customTruthId) {
      updatedTruth.customTruth = {
        $id: customTruthId,
        Description: customDescription,
        "Quest starter": customQuestStarter,
      };
    }

    updateWorldTruth(truth.$id, updatedTruth).catch(() => {
      setSelectedOptionId(storedTruth?.id);
      setSelectedSubOptionId(storedTruth?.selectedSubItemId ?? null);
    });
  };

  const selectTruthSubOption = (
    truthOptionId: string,
    truthSubOptionId: string
  ) => {
    setSelectedOptionId(truthOptionId);
    setSelectedSubOptionId(truthSubOptionId);
    updateWorldTruth(truth.$id, {
      id: truthOptionId,
      selectedSubItemId: truthSubOptionId,
    }).catch(() => {
      setSelectedOptionId(storedTruth?.id);
      setSelectedSubOptionId(storedTruth?.selectedSubItemId ?? null);
    });
  };

  return (
    <Grid container spacing={2}>
      {truth.Table.map((truthOption) => (
        <Grid
          item
          xs={12}
          md={6 > 12 / maxCols ? 6 : 12 / maxCols}
          lg={4 > 12 / maxCols ? 4 : 12 / maxCols}
          key={truthOption.$id}
        >
          <StarforgedTruthCard
            key={truthOption.$id}
            truth={truth}
            truthOptionId={truthOption.$id}
            hideHeader
            fullHeight
            selected={truthOption.$id === selectedOptionId}
            onSelect={() => selectTruthOption(truthOption.$id)}
            selectedSubItemId={selectedSubOptionId}
            onSelectSubItem={(subOptionId) =>
              selectTruthSubOption(truthOption.$id, subOptionId)
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
              selectedOptionId === customTruthId
                ? theme.palette.primary.light
                : undefined,
          })}
          variant={"outlined"}
        >
          <Stack spacing={2}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant={"h6"}>Custom Truth</Typography>
              {selectedOptionId === customTruthId && (
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
