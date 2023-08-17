import { Box, Card, CardActionArea, Typography } from "@mui/material";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "stores/store";
import { StoredCampaign } from "types/Campaign.type";

export interface CampaignCard {
  campaign: StoredCampaign;
  campaignId: string;
}

export function CampaignCard(props: CampaignCard) {
  const { campaign, campaignId } = props;

  const gmIds = campaign.gmIds;

  const loadUserDocuments = useStore((store) => store.users.loadUserDocuments);
  useEffect(() => {
    loadUserDocuments(gmIds ?? []);
  }, [gmIds, loadUserDocuments]);

  const gmNameString = useStore((store) => {
    let gmNames: string[] = [];
    gmIds?.forEach((gmId) => {
      const displayName = store.users.userMap[gmId]?.doc?.displayName;
      if (displayName) {
        gmNames.push(displayName);
      }
    });
    return gmNames.join(", ");
  });

  return (
    <Card elevation={2}>
      <CardActionArea
        component={Link}
        to={constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.SHEET)}
        sx={{ p: 2 }}
      >
        <Box>
          <Typography variant={"h6"}>{campaign.name}</Typography>
          <Typography color={"textSecondary"}>
            {(!campaign.gmIds || campaign.gmIds.length === 0) && "No GM Found"}
            {gmNameString}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
