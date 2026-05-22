import {
  Alert,
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { useStore } from "stores/store";
import CharacterIcon from "@mui/icons-material/Person";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { TruthCard } from "./TruthCard";
import { TruthChooser } from "./TruthChooser";
import { CUSTOM_TRUTH_INDEX } from "./customTruthIndex";

export interface WorldTruthsProps {
  canEdit: boolean;
  hideCampaignHints?: boolean;
}

export function WorldTruths(props: WorldTruthsProps) {
  const { canEdit, hideCampaignHints } = props;

  const worldTruths = useStore((store) => store.rules.worldTruths);
  const truthSelections = useStore(
    (store) => store.worlds.currentWorld.currentWorld?.newTruths ?? {}
  );
  let areAllTruthsChosen = true;
  Object.keys(worldTruths).forEach((truthId) => {
    if (!truthSelections[truthId]) {
      areAllTruthsChosen = false;
    }
  });

  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up("md"));
  const isLargerThanLg = useMediaQuery(theme.breakpoints.up("lg"));

  if (!areAllTruthsChosen && !canEdit) {
    return <></>;
  }
  if (!areAllTruthsChosen) {
    return (
      <>
        <SectionHeading label={"Truths"} breakContainer sx={{ mt: 4 }} />{" "}
        {!hideCampaignHints && (
          <Alert severity={"info"} sx={{ mt: 2 }}>
            If you add this world to a campaign, the world truths will be shared
            with your players, but the quest starters will not.
          </Alert>
        )}
        <Stack spacing={4} sx={{ mt: 2 }}>
          {Object.keys(worldTruths).map((truthKey, index) => (
            <Box key={index}>
              <Typography variant={"h5"} sx={{ mb: 1 }}>
                {index + 1 + ". " + worldTruths[truthKey].name}
              </Typography>
              {worldTruths[truthKey].your_character && (
                <Alert
                  icon={<CharacterIcon sx={{ mt: 1 }} fontSize={"inherit"} />}
                  severity={"info"}
                  sx={{ mb: 2 }}
                >
                  <MarkdownRenderer
                    markdown={worldTruths[truthKey].your_character ?? ""}
                  />
                </Alert>
              )}
              <TruthChooser truthKey={truthKey} truth={worldTruths[truthKey]} />
            </Box>
          ))}
        </Stack>
      </>
    );
  }

  let mod = 1;
  if (isLargerThanLg) {
    mod = 3;
  } else if (isLargerThanMd) {
    mod = 2;
  }

  const groupedTruthKeys: string[][] = [];
  Object.keys(worldTruths).forEach((truthKey, index) => {
    const groupedIndex = index % mod;
    if (!Array.isArray(groupedTruthKeys[groupedIndex])) {
      groupedTruthKeys[groupedIndex] = [truthKey];
    } else {
      groupedTruthKeys[groupedIndex].push(truthKey);
    }
  });

  return (
    <>
      <SectionHeading label={"Truths"} breakContainer sx={{ mt: 4 }} />
      {canEdit && !hideCampaignHints && (
        <Alert severity={"info"} sx={{ mt: 2 }}>
          If you add this world to a campaign, the world truths will be shared
          with your players, but the quest starters will not.
        </Alert>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {groupedTruthKeys.map((group, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Stack spacing={2}>
              {group.map((truthKey) => (
                <TruthCard
                  key={truthKey}
                  truthKey={truthKey}
                  truth={worldTruths[truthKey]}
                  truthOption={
                    truthSelections[truthKey].selectedTruthOptionIndex ===
                    CUSTOM_TRUTH_INDEX
                      ? {
                          _id: "custom",
                          roll: { min: -1, max: -1 },
                          description:
                            truthSelections[truthKey].customTruth
                              ?.description ?? "",
                          quest_starter:
                            truthSelections[truthKey].customTruth
                              ?.questStarter ?? "",
                        }
                      : worldTruths[truthKey].options[
                          truthSelections[truthKey].selectedTruthOptionIndex ??
                            0
                        ]
                  }
                  selectedSubItemIndex={
                    truthSelections[truthKey].selectedSubItemIndex
                  }
                  canEdit={canEdit}
                />
              ))}
            </Stack>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
