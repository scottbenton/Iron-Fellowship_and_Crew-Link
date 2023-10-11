import {
  Alert,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { truthIds, truthMap } from "data/truths";
import { useStore } from "stores/store";
import { IronswornWorldTruthChooser } from "./IronswornWorldTruthChooser";
import { IronswornTruthCard } from "./IronswornTruthCard";
import { SectionHeading } from "components/shared/SectionHeading";

export interface IronswornWorldTruthsSectionProps {
  canEdit: boolean;
  hideCampaignHints?: boolean;
}

export function IronswornWorldTruthsSection(
  props: IronswornWorldTruthsSectionProps
) {
  const { canEdit, hideCampaignHints } = props;

  const worldTruths = useStore(
    (store) => store.worlds.currentWorld.currentWorld?.truths ?? {}
  );

  const areAllTruthsChosen =
    Object.keys(worldTruths).length === truthIds.length;

  const theme = useTheme();
  const isLargerThanMd = useMediaQuery(theme.breakpoints.up("md"));
  const isLargerThanLg = useMediaQuery(theme.breakpoints.up("lg"));

  if (!areAllTruthsChosen) {
    if (!canEdit) return <></>;
    return (
      <>
        <SectionHeading label={"World Truths"} breakContainer sx={{ mt: 4 }} />{" "}
        {canEdit && !hideCampaignHints && (
          <Alert severity={"info"} sx={{ mt: 2 }}>
            If you add this world to a campaign, the world truths will be shared
            with your players, but the quest starters will not.
          </Alert>
        )}
        <Stack spacing={4} sx={{ mt: 2 }}>
          {truthIds.map((truthId, index) => (
            <div key={truthId}>
              <Typography variant={"h5"} sx={{ mb: 1 }}>
                {index + 1 + ". " + truthMap[truthId].Title.Standard}
              </Typography>
              <IronswornWorldTruthChooser
                key={truthId}
                truthId={truthId}
                initialTruth={worldTruths[truthId]}
              />
            </div>
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

  let groupedTruthIds: string[][] = [];
  truthIds.forEach((truthId, index) => {
    const groupedIndex = index % mod;
    if (!Array.isArray(groupedTruthIds[groupedIndex])) {
      groupedTruthIds[groupedIndex] = [truthId];
    } else {
      groupedTruthIds[groupedIndex].push(truthId);
    }
  });

  return (
    <>
      <SectionHeading label={"World Truths"} breakContainer sx={{ mt: 4 }} />
      {canEdit && !hideCampaignHints && (
        <Alert severity={"info"} sx={{ mt: 2 }}>
          If you add this world to a campaign, the world truths will be shared
          with your players, but the quest starters will not.
        </Alert>
      )}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {groupedTruthIds.map((group, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Stack spacing={2}>
              {group.map((truthId, index) => (
                <IronswornTruthCard
                  key={truthId}
                  truthId={truthId}
                  storedTruth={worldTruths[truthId]}
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
