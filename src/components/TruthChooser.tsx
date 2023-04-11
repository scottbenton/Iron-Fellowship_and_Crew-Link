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
import CheckIcon from "@mui/icons-material/Check";
import { getCustomTruthId } from "features/world-create/worldCreate.store";

export interface TruthChooserProps {
  truthId: string;
  selectedTruthOptionId?: string;
  selectTruthOption: (truthSelectionId: string) => void;
  customDescription?: string;
  changeCustomTruthDescription: (description: string) => void;
  customTruthQuestStarter?: string;
  changeCustomTruthQuestStarter: (questStarter: string) => void;
  maxColumns?: number;
}

export function TruthChooser(props: TruthChooserProps) {
  const {
    truthId,
    selectedTruthOptionId,
    selectTruthOption,
    customDescription,
    changeCustomTruthDescription,
    customTruthQuestStarter,
    changeCustomTruthQuestStarter,
    maxColumns,
  } = props;
  const truth = truthMap[truthId];

  if (!truth) {
    return null;
  }

  const minGridValue = maxColumns ? 12 / maxColumns : 4;

  const customTruthId = getCustomTruthId(truthId);

  return (
    <Grid container spacing={2}>
      {truth.Options.map((option) => (
        <Grid
          item
          xs={12}
          md={6 > minGridValue ? 6 : minGridValue}
          lg={4 > minGridValue ? 4 : minGridValue}
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
                selectedTruthOptionId === option.$id
                  ? theme.palette.secondary.light
                  : undefined,
            })}
          >
            <Box sx={{ width: "100%" }}>
              <Typography>
                <Box
                  component={"span"}
                  sx={{ float: "right", width: 24, height: 24 }}
                >
                  {selectedTruthOptionId === option.$id && (
                    <CheckIcon color={"secondary"} />
                  )}
                </Box>
                {option.Description}
              </Typography>
            </Box>
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.background.default,
                borderRadius: theme.shape.borderRadius,
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
        md={6 > minGridValue ? 6 : minGridValue}
        lg={4 > minGridValue ? 4 : minGridValue}
      >
        <Card
          sx={(theme) => ({
            p: 2,
            height: "100%",
            borderWidth: 2,
            borderColor:
              selectedTruthOptionId === customTruthId
                ? theme.palette.secondary.light
                : undefined,
          })}
          variant={"outlined"}
        >
          <Stack spacing={2}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant={"h6"}>Custom Truth</Typography>
              {selectedTruthOptionId === customTruthId && (
                <CheckIcon color={"secondary"} />
              )}
            </Box>
            <TextField
              label={"Description"}
              minRows={3}
              fullWidth
              multiline
              value={customDescription ?? ""}
              onChange={(evt) =>
                changeCustomTruthDescription(evt.currentTarget.value)
              }
            />
            <TextField
              label={"Quest Starter"}
              minRows={3}
              fullWidth
              multiline
              value={customTruthQuestStarter ?? ""}
              onChange={(evt) =>
                changeCustomTruthQuestStarter(evt.currentTarget.value)
              }
            />
            <Box onClick={() => selectTruthOption(customTruthId)}>
              <Button variant={"outlined"}>Select</Button>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
