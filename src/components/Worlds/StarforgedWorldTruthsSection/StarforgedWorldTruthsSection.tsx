import {
  Alert,
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { starforgedTruths } from "data/truths";
import { StarforgedTruthCard } from "./StarforgedTruthCard";
import { useStore } from "stores/store";
import { StarforgedTruthChooser } from "./StarforgedTruthChooser";
import CharacterIcon from "@mui/icons-material/Person";
import { MarkdownRenderer } from "components/MarkdownRenderer";
import { TruthStarforged } from "dataforged";

export interface StarforgedWorldTruthsSectionProps {
  canEdit: boolean;
  hideCampaignHints?: boolean;
}

export function StarforgedWorldTruthsSection(
  props: StarforgedWorldTruthsSectionProps
) {
  const { canEdit, hideCampaignHints } = props;

  const truths = useStore(
    (store) => store.worlds.currentWorld.currentWorld?.truths ?? {}
  );
  const areAllTruthsChosen =
    Object.keys(truths).length === starforgedTruths.length;

  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up("md"));
  const isLargerThanLg = useMediaQuery(theme.breakpoints.up("lg"));

  if (!areAllTruthsChosen) {
    if (!canEdit) {
      return <></>;
    }
    return (
      <>
        <SectionHeading label={"Truths"} breakContainer sx={{ mt: 4 }} />
        {canEdit && !hideCampaignHints && (
          <Alert severity={"info"} sx={{ mt: 2 }}>
            If you add this world to a campaign, the world truths will be shared
            with your players, but the quest starters will not.
          </Alert>
        )}
        <Stack spacing={4} sx={{ mt: 2 }}>
          {starforgedTruths.map((truth, index) => (
            <Box key={truth.$id}>
              <Typography variant={"h5"} sx={{ mb: 1 }}>
                {index + 1 + ". " + truth.Title.Standard}
              </Typography>
              {truth.Character && (
                <Alert
                  icon={<CharacterIcon sx={{ mt: 1 }} fontSize={"inherit"} />}
                  severity={"info"}
                  sx={{ mb: 2 }}
                >
                  <MarkdownRenderer markdown={truth.Character} />
                </Alert>
              )}
              <StarforgedTruthChooser truth={truth} />
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

  let groupedTruths: TruthStarforged[][] = [];
  starforgedTruths.forEach((truth, index) => {
    const groupedIndex = index % mod;
    if (!Array.isArray(groupedTruths[groupedIndex])) {
      groupedTruths[groupedIndex] = [truth];
    } else {
      groupedTruths[groupedIndex].push(truth);
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
        {groupedTruths.map((group, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Stack spacing={2}>
              {group.map((truth) => (
                <StarforgedTruthCard
                  key={truth.$id}
                  truth={truth}
                  truthOptionId={truths[truth.$id].id}
                  selectedSubItemId={truths[truth.$id].selectedSubItemId}
                  customTruth={
                    truths[truth.$id].customTruth
                      ? {
                          description:
                            truths[truth.$id].customTruth?.Description ?? "",
                          questStarter:
                            truths[truth.$id].customTruth?.["Quest starter"],
                        }
                      : undefined
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
