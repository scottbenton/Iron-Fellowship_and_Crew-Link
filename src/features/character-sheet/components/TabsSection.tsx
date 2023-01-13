import { Box, Card, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { StoredAsset } from "../../../types/Asset.type";
import { AssetsSection } from "./AssetsSection";

export interface TabsSectionProps {
  assets?: StoredAsset[];
}

export function TabsSection(props: TabsSectionProps) {
  const { assets } = props;

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  return (
    <Card
      variant={"outlined"}
      sx={{ flexGrow: 1, mt: 2, display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTabIndex}
          onChange={(evt, value) => setSelectedTabIndex(value)}
          aria-label="basic tabs example"
        >
          <Tab label="Assets" />
          <Tab label="Bonds" />
          <Tab label="Item Three" />
        </Tabs>
      </Box>
      <Box flexGrow={1} overflow={"auto"}>
        {selectedTabIndex === 0 && assets && (
          <AssetsSection assetData={assets} />
        )}
      </Box>
    </Card>
  );
}
