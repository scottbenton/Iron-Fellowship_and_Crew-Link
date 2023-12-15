import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { LinkComponent } from "components/shared/LinkComponent";
import { useState } from "react";
import { useStore } from "stores/store";
import ExpandIcon from "@mui/icons-material/ChevronRight";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";

export function CampaignMenu() {
  const uid = useStore((store) => store.auth.uid);
  const campaigns = useStore((store) => store.campaigns.campaignMap);

  const [expandedCampaigns, setExpandedCampaigns] = useState<
    Record<string, boolean>
  >({});
  const toggleExpand = (campaignId: string) => {
    setExpandedCampaigns((prevCampaigns) => {
      const newCampaigns = { ...prevCampaigns };
      newCampaigns[campaignId] = !newCampaigns[campaignId];
      return newCampaigns;
    });
  };

  return (
    <>
      <Typography variant={"h6"} component={"p"} px={2}>
        Campaigns
      </Typography>
      <List>
        {Object.keys(campaigns).map((campaignId) => (
          <Box key={campaignId}>
            {campaigns[campaignId].gmIds?.includes(uid) ? (
              <>
                <ListItem key={campaignId} disablePadding>
                  <ListItemButton
                    onClick={() => toggleExpand(campaignId)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItemText primary={campaigns[campaignId].name} />
                    <ListItemIcon sx={{ minWidth: "unset" }}>
                      <ExpandIcon
                        sx={(theme) => ({
                          color: "grey.200",
                          transform: `rotate(${
                            expandedCampaigns[campaignId] ? "-" : ""
                          }90deg)`,
                          transition: theme.transitions.create(["transform"], {
                            duration: theme.transitions.duration.shorter,
                          }),
                        })}
                      />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
                <Collapse in={expandedCampaigns[campaignId]}>
                  <ListItem key={`${campaignId}-sheet`} disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      LinkComponent={LinkComponent}
                      href={constructCampaignSheetPath(
                        campaignId,
                        CAMPAIGN_ROUTES.SHEET
                      )}
                    >
                      <ListItemText primary={"Campaign Sheet"} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem key={`${campaignId}-gm-screen`} disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      LinkComponent={LinkComponent}
                      href={constructCampaignSheetPath(
                        campaignId,
                        CAMPAIGN_ROUTES.GM_SCREEN
                      )}
                    >
                      <ListItemText primary={"GM Screen"} />
                    </ListItemButton>
                  </ListItem>
                </Collapse>
              </>
            ) : (
              <ListItem key={campaignId} disablePadding>
                <ListItemButton
                  LinkComponent={LinkComponent}
                  href={constructCampaignSheetPath(
                    campaignId,
                    CAMPAIGN_ROUTES.SHEET
                  )}
                >
                  <ListItemText primary={campaigns[campaignId].name} />
                </ListItemButton>
              </ListItem>
            )}
          </Box>
        ))}
      </List>
    </>
  );
}
