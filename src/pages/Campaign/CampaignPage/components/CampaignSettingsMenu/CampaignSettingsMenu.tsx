import {
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/ManageAccounts";
import { useState } from "react";
import { EditCampaign } from "./EditCampaign";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router-dom";
import { CAMPAIGN_ROUTES, constructCampaignPath } from "pages/Campaign/routes";
import { useStore } from "stores/store";
import { useCampaignType } from "hooks/useCampaignType";
import { CampaignType } from "api-calls/campaign/_campaign.type";
import HomebrewIcon from "@mui/icons-material/PlaylistAdd";
import AssetCardsIcon from "@mui/icons-material/AutoAwesomeMotion";
import { ExpansionSelectorDialog } from "components/features/charactersAndCampaigns/ExpansionSelector/ExpansionSelectorDialog";
import StepDownIcon from "@mui/icons-material/PersonRemove";
import LeaveIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThemeIcon from "@mui/icons-material/ColorLens";
import { ThemeChooserDialog } from "components/shared/Layout/ThemeChooserDialog";
import LayoutIcon from "@mui/icons-material/ViewComfy";
import { LayoutChooserDialog } from "components/shared/Layout/LayoutChooserDialog";
import { AssetCardDialog } from "components/features/assets/AssetCardDialog";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { HideOraclesDialog } from "./HideOraclesDialog";
import OracleHideIcon from '@mui/icons-material/PlaylistRemove';

export function CampaignSettingsMenu() {
  const confirm = useConfirm();
  const navigate = useNavigate();

  const { campaignType, showGuidedPlayerView } = useCampaignType();

  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );

  const [expansionSelectorDialogOpen, setExpansionSelectorDialogOpen] =
    useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [layoutDialogOpen, setLayoutDialogOpen] = useState(false);
  const [oraclesDialogOpen, setOraclesDialogOpen] = useState(false);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [hideAssetsLoading, setHideAssetsLoading] = useState(false);
  const [isEditCampaignOpen, setIsEditCampaignOpen] = useState(false);
  const handleClose = () => setAnchorElement(null);

  const leaveCampaign = useStore(
    (store) => store.campaigns.currentCampaign.leaveCampaign
  );
  const handleLeaveCampaign = () => {
    confirm({
      title: "Leave Campaign",
      description: "Are you sure you want to leave this campaign?",
      confirmationText: "Leave",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        leaveCampaign()
          .then(() => {
            navigate(constructCampaignPath(CAMPAIGN_ROUTES.SELECT));
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  const isGuide = useStore(
    (store) =>
      store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
        store.auth.uid
      ) ?? false
  );

  const deleteCampaign = useStore(
    (store) => store.campaigns.currentCampaign.deleteCampaign
  );
  const handleDeleteCampaign = () => {
    confirm({
      title: "End Campaign",
      description:
        "Are you sure you want to end your campaign? This will also remove your current characters from the campaign",
      confirmationText: "End",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    }).then(() => {
      deleteCampaign()
        .then(() => {
          navigate(constructCampaignPath(CAMPAIGN_ROUTES.SELECT));
        })
        .catch(() => {});
    });
  };

  const uid = useStore((store) => store.auth.uid);
  const updateCampaignGM = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignGM
  );

  const removeSelfAsGuide = () => {
    updateCampaignGM(uid, true).catch(() => {});
  };

  const hiddenAssets = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.hiddenAssetIds
  )
  const updateHiddenAssets = useStore(
    (store) => store.campaigns.currentCampaign.updateHiddenAssets
  );

  const handleHideAsset = (asset: Omit<AssetDocument, "order">) => {
    setHideAssetsLoading(true);
    const isHidden = hiddenAssets && hiddenAssets.includes(asset.id);
    updateHiddenAssets(asset.id, !isHidden)
      .catch(() => {})
      .finally(() => {
        setHideAssetsLoading(false);
      });
  };

  return (
    <>
      <Tooltip title={"Campaign Settings"}>
        <IconButton
          color={"inherit"}
          aria-label={"Settings"}
          onClick={(evt) => {
            setAnchorElement(evt.currentTarget);
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        open={!!anchorElement}
        anchorEl={anchorElement}
        onClose={handleClose}
        MenuListProps={{
          subheader: (
            <ListSubheader component={"div"} disableSticky>
              Campaign Settings
            </ListSubheader>
          ),
        }}
      >
        {!showGuidedPlayerView && (
          <MenuItem
            onClick={() => {
              handleClose();
              setIsEditCampaignOpen(true);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize={"small"} />
            </ListItemIcon>
            <ListItemText>Edit Campaign</ListItemText>
          </MenuItem>
        )}
        {!showGuidedPlayerView && (
          <MenuItem
            onClick={() => {
              handleClose();
              setExpansionSelectorDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <HomebrewIcon fontSize={"small"} />
            </ListItemIcon>
            <ListItemText>Expansions & Homebrew</ListItemText>
          </MenuItem>
        )}
        {!showGuidedPlayerView && (
          <MenuItem
            onClick={() => {
              handleClose();
              setAssetDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <AssetCardsIcon fontSize={"small"} />
            </ListItemIcon>
            <ListItemText>Edit Assets Deck</ListItemText>
          </MenuItem>
        )}
        {!showGuidedPlayerView && (
          <MenuItem
            onClick={() => {
              handleClose();
              setOraclesDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <OracleHideIcon />
            </ListItemIcon>
            <ListItemText>Hide Oracles</ListItemText>
          </MenuItem>
        )}
        {!showGuidedPlayerView && (
          <MenuItem
            onClick={() => {
              handleClose();
              setThemeDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <ThemeIcon />
            </ListItemIcon>
            <ListItemText>Change Theme</ListItemText>
          </MenuItem>
        )}
        {!showGuidedPlayerView && campaignType !== CampaignType.Solo && (
          <MenuItem
            onClick={() => {
              handleClose();
              setLayoutDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <LayoutIcon />
            </ListItemIcon>
            <ListItemText>Change Layout</ListItemText>
          </MenuItem>
        )}
        {campaignType !== CampaignType.Solo && (
          <MenuItem
            onClick={() => {
              handleClose();
              handleLeaveCampaign();
            }}
          >
            <ListItemIcon>
              <LeaveIcon fontSize={"small"} />
            </ListItemIcon>
            <ListItemText>Leave Campaign</ListItemText>
          </MenuItem>
        )}
        {!showGuidedPlayerView && (
          <MenuItem
            onClick={() => {
              handleClose();
              handleDeleteCampaign();
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize={"small"} />
            </ListItemIcon>

            <ListItemText>Delete Campaign</ListItemText>
          </MenuItem>
        )}
        {isGuide && campaignType === CampaignType.Guided && (
          <MenuItem
            onClick={() => {
              handleClose();
              removeSelfAsGuide();
            }}
          >
            <ListItemIcon>
              <StepDownIcon fontSize={"small"} />
            </ListItemIcon>
            <ListItemText>Step Down as Guide</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <EditCampaign
        open={isEditCampaignOpen}
        onClose={() => setIsEditCampaignOpen(false)}
      />
      <ExpansionSelectorDialog
        open={expansionSelectorDialogOpen}
        onClose={() => setExpansionSelectorDialogOpen(false)}
      />
      <ThemeChooserDialog
        open={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)}
      />
      <LayoutChooserDialog
        open={layoutDialogOpen}
        onClose={() => setLayoutDialogOpen(false)}
      />
      <AssetCardDialog
        open={assetDialogOpen}
        loading={hideAssetsLoading}
        handleClose={() => setAssetDialogOpen(false)}
        handleAssetSelection={(asset) => handleHideAsset(asset)}
        actionIsHide
      />
      <HideOraclesDialog
        open={oraclesDialogOpen}
        onClose={() => setOraclesDialogOpen(false)}
      />
    </>
  );
}
