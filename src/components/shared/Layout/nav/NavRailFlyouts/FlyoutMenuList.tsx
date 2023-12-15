import { Divider, List, Typography } from "@mui/material";
import React from "react";

export interface FlyoutMenuListProps {
  label: string;
  itemIds: string[];
  renderListItem: (itemId: string) => React.JSX.Element;
}

export function FlyoutMenuList(props: FlyoutMenuListProps) {
  const { label, itemIds, renderListItem } = props;

  return (
    <>
      <Typography variant={"h6"} component={"p"} px={2}>
        {label}
      </Typography>
      <Divider sx={{ borderColor: "darkGrey.light", ml: 1, mr: 6 }} />
      {itemIds.length > 0 ? (
        <List>{itemIds.map((itemId) => renderListItem(itemId))}</List>
      ) : (
        <>
          <Typography variant={"body2"} px={2} mt={2}>
            No {label} Found
          </Typography>
        </>
      )}
    </>
  );
}
