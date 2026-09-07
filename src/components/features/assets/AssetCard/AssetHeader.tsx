import { Datasworn } from "@datasworn-community/core";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { getIsLocalEnvironment } from "functions/getGameSystem";
import LinkIcon from "@mui/icons-material/Link";
import DeleteIcon from "@mui/icons-material/Delete";

export interface AssetHeaderProps {
  asset: Datasworn.Asset;
  onAssetRemove?: () => void;
  actions?: React.ReactNode;
}

export function AssetHeader(props: AssetHeaderProps) {
  const { asset, onAssetRemove, actions } = props;

  const isLocal = getIsLocalEnvironment();

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      px={1}
      bgcolor={"darkGrey.light"}
      color={"darkGrey.contrastText"}
      height={(theme) => theme.spacing(5)}
    >
      <Typography
        color={"inherit"}
        fontFamily={(theme) => theme.fontFamilyTitle}
      >
        {asset.category}
      </Typography>
      <Box display={"flex"} alignItems={"center"}>
        {isLocal && (
          <Tooltip title={asset._id}>
            <LinkIcon color={"inherit"} />
          </Tooltip>
        )}
        {actions}
        {onAssetRemove && (
          <Tooltip title={"Remove Asset"}>
            <IconButton color={"inherit"} onClick={onAssetRemove}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
