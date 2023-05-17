import { Box, Card, CardActionArea, Skeleton, Typography } from "@mui/material";
import { useUserDoc } from "api/user/getUserDoc";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { Link } from "react-router-dom";
import { StoredCampaign } from "types/Campaign.type";

export interface CampaignCard {
  campaign: StoredCampaign;
  campaignId: string;
}

export function CampaignCard(props: CampaignCard) {
  const { campaign, campaignId } = props;

  const { user } = useUserDoc(campaign.gmId);

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
            {campaign.gmId && user ? (
              `GM: ${user.displayName}`
            ) : (
              <Skeleton width={"12ch"} />
            )}
            {!campaign.gmId && "No GM Found"}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
