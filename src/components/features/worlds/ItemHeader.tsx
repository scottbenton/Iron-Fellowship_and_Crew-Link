import {
  Box,
  IconButton,
  Stack,
  SxProps,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export interface ItemHeaderProps {
  itemName: string;
  updateName: (name: string) => void;
  nameOracleIds?: string | string[] | (string | string[])[];
  joinOracles?: boolean;
  actions?: React.ReactNode;
  closeItem: () => void;
  sx?: SxProps;
}

export function ItemHeader(props: ItemHeaderProps) {
  const {
    itemName,
    updateName,
    nameOracleIds,
    joinOracles,
    closeItem,
    actions,
    sx,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={[
        (theme) => ({
          bgcolor: theme.palette.background.paper,
          py: 1,
          px: 3,
          [theme.breakpoints.down("sm")]: { px: 2 },
        }),

        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      display={"flex"}
      alignItems={"start"}
      flexWrap={"wrap-reverse"}
      justifyContent={"space-between"}
    >
      <DebouncedOracleInput
        label={"Name"}
        variant={"outlined"}
        color={"primary"}
        oracleTableId={nameOracleIds}
        joinOracleTables={joinOracles}
        initialValue={itemName}
        updateValue={updateName}
        fullWidth={isMobile}
        sx={{
          mt: 1,
        }}
      />
      <Stack
        direction={"row"}
        sx={{ ml: "auto", pb: 1 }}
        display={"flex"}
        alignItems={"start"}
      >
        {actions}
        <Tooltip title={"Close"}>
          <IconButton onClick={closeItem}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
