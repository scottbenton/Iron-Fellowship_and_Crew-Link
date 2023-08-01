import { Box, Card, CardActionArea, Skeleton, Typography } from "@mui/material";
import { useGetUserDoc, useUserDoc, useUserDocs } from "api/user/getUserDoc";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StoredCampaign } from "types/Campaign.type";
import { UserDocument } from "types/User.type";

export interface CampaignCard {
  campaign: StoredCampaign;
  campaignId: string;
}

export function CampaignCard(props: CampaignCard) {
  const { campaign, campaignId } = props;

  const gmIds = campaign.gmIds;

  const gms = useUserDocs(gmIds ?? []);

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
            {campaign.gmIds && (
              <>{gms.map((gm) => gm.displayName).join(", ")}</>
            )}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
