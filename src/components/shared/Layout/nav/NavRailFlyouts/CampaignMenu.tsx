import {
  Box,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { LinkComponent } from "components/shared/LinkComponent";
import { useState } from "react";
import { useStore } from "stores/store";
import ExpandIcon from "@mui/icons-material/ChevronRight";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { FlyoutMenuList } from "./FlyoutMenuList";

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
    <FlyoutMenuList
      label={"Campaigns"}
      itemIds={Object.keys(campaigns)}
      renderListItem={(campaignId) =>
        campaigns[campaignId].gmIds?.includes(uid) ? (
          <Box
            component={"li"}
            sx={{ listStyleImage: "none" }}
            key={campaignId}
          >
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
            <Collapse
              key={`${campaignId}-collapse`}
              in={expandedCampaigns[campaignId]}
            >
              <Box component={"ul"} p={0}>
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
              </Box>
            </Collapse>
          </Box>
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
        )
      }
    />
  );
}
