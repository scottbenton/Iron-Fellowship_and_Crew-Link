import { Datasworn } from "@datasworn/core";
import { Box, Tooltip, Typography } from "@mui/material";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import GroupIcon from "@mui/icons-material/Group";

export interface AssetNameAndDescriptionProps {
  asset: Datasworn.Asset;
  showSharedIcon?: boolean;
}

export function AssetNameAndDescription(props: AssetNameAndDescriptionProps) {
  const { asset, showSharedIcon } = props;

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography
          variant={"h5"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {asset.name}
        </Typography>
        {asset.shared && showSharedIcon && (
          <Tooltip title={"Shared"}>
            <GroupIcon color={"primary"} />
          </Tooltip>
        )}
      </Box>
      {asset.requirement && (
        <Box color={(theme) => theme.palette.text.secondary}>
          <MarkdownRenderer inheritColor markdown={asset.requirement} />
        </Box>
      )}
    </>
  );
}
