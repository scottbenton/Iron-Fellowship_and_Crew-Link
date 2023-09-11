import { ChipProps, Chip, Box, Menu, MenuItem } from "@mui/material";
import { INITIATIVE_STATUS } from "types/Character.type";
import DropdownIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export interface InitiativeStatusChipProps {
  status: INITIATIVE_STATUS;
  handleStatusChange?: (newStatus: INITIATIVE_STATUS) => void;
  loading: boolean;
  variant?: "filled" | "outlined";
}

const getStatusProps = (status: INITIATIVE_STATUS): Partial<ChipProps> => {
  switch (status) {
    case INITIATIVE_STATUS.HAS_INITIATIVE:
      return {
        color: "success",
      };
    case INITIATIVE_STATUS.DOES_NOT_HAVE_INITIATIVE:
      return {
        color: "error",
      };
    case INITIATIVE_STATUS.OUT_OF_COMBAT:
      return {
        color: "primary",
      };
  }
};

const getStatusText = (status: INITIATIVE_STATUS): string => {
  switch (status) {
    case INITIATIVE_STATUS.HAS_INITIATIVE:
      return "Has Initiative";
    case INITIATIVE_STATUS.DOES_NOT_HAVE_INITIATIVE:
      return "Does not have Initiative";
    case INITIATIVE_STATUS.OUT_OF_COMBAT:
      return "Out of Combat";
  }
};

export function InitiativeStatusChip(props: InitiativeStatusChipProps) {
  const { status, handleStatusChange, loading, variant } = props;

  const [menuParent, setMenuParent] = useState<HTMLElement>();

  const onStatusChangeClick = (status: INITIATIVE_STATUS) => {
    handleStatusChange && handleStatusChange(status);
    setMenuParent(undefined);
  };

  return (
    <span>
      <Chip
        size={"small"}
        label={
          <Box display={"flex"} alignItems={"center"}>
            {getStatusText(status)}
            {handleStatusChange && <DropdownIcon sx={{ ml: 1 }} />}
          </Box>
        }
        variant={variant ?? "filled"}
        onClick={
          handleStatusChange
            ? (evt) => setMenuParent(evt.currentTarget)
            : undefined
        }
        {...getStatusProps(status)}
      />
      <Menu
        open={!!menuParent}
        anchorEl={menuParent}
        onClose={() => setMenuParent(undefined)}
      >
        <MenuItem
          onClick={() => onStatusChangeClick(INITIATIVE_STATUS.HAS_INITIATIVE)}
        >
          {getStatusText(INITIATIVE_STATUS.HAS_INITIATIVE)}
        </MenuItem>
        <MenuItem
          onClick={() =>
            onStatusChangeClick(INITIATIVE_STATUS.DOES_NOT_HAVE_INITIATIVE)
          }
        >
          {getStatusText(INITIATIVE_STATUS.DOES_NOT_HAVE_INITIATIVE)}
        </MenuItem>
        <MenuItem
          onClick={() => onStatusChangeClick(INITIATIVE_STATUS.OUT_OF_COMBAT)}
        >
          {getStatusText(INITIATIVE_STATUS.OUT_OF_COMBAT)}
        </MenuItem>
      </Menu>
    </span>
  );
}
