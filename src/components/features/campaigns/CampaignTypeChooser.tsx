import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardActionArea,
  Grid,
  Typography,
} from "@mui/material";
import { CampaignType } from "api-calls/campaign/_campaign.type";
import { useId } from "react";

import SoloIcon from "@mui/icons-material/Person4";
import CoopIcon from "@mui/icons-material/Group";
import GuidedIcon from "@mui/icons-material/Groups2";

const campaignTypeConfigs: Record<
  CampaignType,
  { Icon: typeof SoloIcon; title: string; description: string }
> = {
  [CampaignType.Solo]: {
    Icon: SoloIcon,
    title: "Solo",
    description:
      "A single player plays one or more characters. Text and content only useful in multiplayer campaigns is hidden.",
  },
  [CampaignType.Coop]: {
    Icon: CoopIcon,
    title: "Co-op",
    description:
      "A co-op campaign has multiple players, each playing a character, no guide required. Text and content only useful in guided campaigns is hidden.",
  },
  [CampaignType.Guided]: {
    Icon: GuidedIcon,
    title: "Guided",
    description:
      "A guide takes the role of storyteller and leads characters through the campaign. The guide has access to notes and information that players do not.",
  },
};

export interface CampaignTypeChooserProps {
  type: CampaignType;
  onChange: (type: CampaignType) => void;
  hideSolo?: boolean;
}

export function CampaignTypeChooser(props: CampaignTypeChooserProps) {
  const { type, onChange, hideSolo } = props;
  const idPrefix = useId();

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Alert severity={"info"} sx={{ mb: 1 }}>
          <AlertTitle>Campaign Types</AlertTitle>
          Campaign types tailor the experience for players and guides in
          campaigns. Solo players do not need to create a campaign, but can if
          the structure is helpful!
        </Alert>
      </Grid>
      {Object.entries(campaignTypeConfigs)
        .filter(([key]) => (hideSolo ? key !== CampaignType.Solo : true))
        .map(([key, { Icon, title, description }]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Card
              variant={"outlined"}
              key={key}
              sx={{
                height: "100%",
                borderColor: key === type ? "primary.main" : undefined,
              }}
            >
              <CardActionArea
                sx={{
                  p: 1.5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
                aria-pressed={key === type}
                aria-labelledby={`${idPrefix}-${key}-title`}
                onClick={() => onChange(key as CampaignType)}
              >
                <Box display={"flex"} alignItems={"center"} sx={{ mb: 1 }}>
                  <Box
                    borderRadius={999}
                    color={key === type ? "primary.contrastText" : "grey.700"}
                    bgcolor={key === type ? "primary.main" : "grey.200"}
                    p={0.5}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Icon />
                  </Box>
                  <Typography
                    variant={"h6"}
                    component={"span"}
                    sx={{ ml: 1 }}
                    id={`${idPrefix}-${key}-title`}
                  >
                    {title}
                  </Typography>
                </Box>
                <Typography variant={"body2"} color={"textSecondary"}>
                  {description}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}
