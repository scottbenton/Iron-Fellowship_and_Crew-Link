import { Box, IconButton, Stack, SxProps } from "@mui/material";
import { DebouncedOracleInput } from "components/shared/DebouncedOracleInput";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export interface ItemHeaderProps {
  itemName: string;
  updateName: (name: string) => void;
  nameOracleIds: string | string[];
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

  return (
    <Box
      sx={[
        (theme) => ({ bgcolor: theme.palette.background.paper, py: 1 }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      px={2}
    >
      <DebouncedOracleInput
        placeholder={"Name"}
        variant={"standard"}
        color={"primary"}
        oracleTableId={nameOracleIds}
        joinOracleTables={joinOracles}
        initialValue={itemName}
        updateValue={updateName}
        sx={{
          maxWidth: "30ch",
          ["& .MuiInputBase-root"]: {
            fontSize: "1.25rem",
          },
        }}
      />
      <Stack
        direction={"row"}
        spacing={2}
        sx={{ ml: 2 }}
        display={"flex"}
        alignItems={"center"}
      >
        {actions}
        <IconButton onClick={closeItem}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
