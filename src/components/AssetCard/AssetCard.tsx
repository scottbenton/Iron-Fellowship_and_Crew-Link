import {
  Box,
  Card,
  Checkbox,
  SxProps,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { Asset } from "../../types/Asset.type";

export interface AssetCardProps {
  asset: Asset;
  readOnly?: boolean;
  hideTracks?: boolean;
  actions?: ReactNode;
  sx?: SxProps<Theme>;
}

export function AssetCard(props: AssetCardProps) {
  const { asset, readOnly, hideTracks, actions, sx } = props;

  return (
    <Card
      variant={"outlined"}
      sx={{ height: "100%", display: "flex", flexDirection: "column", ...sx }}
    >
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: "white",
          p: 1,
        })}
      >
        <Typography fontFamily={(theme) => theme.fontFamilyTitle}>
          {asset.type}
        </Typography>
      </Box>
      <Box p={1} flexGrow={1}>
        <Typography
          variant={"h5"}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {asset.name}
        </Typography>
        {asset.description && (
          <Typography variant={"body2"} color={"GrayText"}>
            {asset.description}
          </Typography>
        )}
        {asset.inputs &&
          asset.inputs.length > 0 &&
          asset.inputs?.map((field, index) => (
            <TextField label={field} variant={"standard"} fullWidth />
          ))}

        <Box>
          {asset.abilities.map((ability, index) => (
            <Box display={"flex"} alignItems={"flex-start"} mt={2}>
              <Checkbox checked={ability.startsEnabled ?? false} />
              <Box key={index}>
                {ability.name && (
                  <Typography display={"inline"}>
                    <b>{ability.name}: </b>
                  </Typography>
                )}
                <Typography display={"inline"} color={"GrayText"}>
                  {ability.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {actions && (
        <Box
          sx={(theme) => ({
            display: "flex",
            justifyContent: "flex-end",
            px: 1,
            pb: 1,
          })}
        >
          {actions}
        </Box>
      )}
    </Card>
  );
}
