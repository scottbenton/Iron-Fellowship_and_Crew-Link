import { Box, Button, Typography } from "@mui/material";
import { useUpdateCampaignGM } from "api/campaign/updateCampaignGM";
import { useUserDoc } from "api/user/getUserDoc";
import { PageBanner } from "components/Layout/PageBanner";
import { useAuth } from "providers/AuthProvider";
import { Link } from "react-router-dom";
import { constructCampaignGMScreenUrl } from "routes";
import { StoredCampaign } from "types/Campaign.type";
import { CampaignActionsMenu } from "./CampaignActionsMenu";

export interface CampaignSheetHeaderProps {
  campaign: StoredCampaign;
  campaignId: string;
}

export function CampaignSheetHeader(props: CampaignSheetHeaderProps) {
  const { campaign, campaignId } = props;

  const uid = useAuth().user?.uid;

  const { updateCampaignGM } = useUpdateCampaignGM();
  const { user: gm } = useUserDoc(campaign.gmId);

  return (
    <>
      <PageBanner>
        <Box
          zIndex={20}
          color={"white"}
          display={"flex"}
          flexWrap={"wrap"}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography
              variant={"h4"}
              fontFamily={(theme) => theme.fontFamilyTitle}
            >
              {campaign.name}
            </Typography>

            {!campaign.gmId && (
              <Button
                onClick={() => updateCampaignGM({ campaignId, gmId: uid })}
                variant={"outlined"}
                color={"inherit"}
                sx={{ mt: 2 }}
              >
                Mark self as GM
              </Button>
            )}
            {campaign.gmId && campaign.gmId !== uid && (
              <Typography
                variant={"h6"}
                fontFamily={(theme) => theme.fontFamilyTitle}
              >
                GM: {gm?.displayName ?? "Loading..."}
              </Typography>
            )}
            {campaign.gmId && campaign.gmId === uid && (
              <Button
                component={Link}
                to={constructCampaignGMScreenUrl(campaignId)}
                variant={"outlined"}
                color={"inherit"}
                sx={{ mt: 2 }}
              >
                Open GM Screen
              </Button>
            )}
          </Box>
          <CampaignActionsMenu campaign={campaign} campaignId={campaignId} />
        </Box>
      </PageBanner>
    </>
  );
}
