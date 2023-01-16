import { Box, Card, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { StoredAsset } from "../../../types/Asset.type";
import { AssetsSection } from "./AssetsSection";

export interface TabsSectionProps {
  assets?: StoredAsset[];
  characterId: string;
}

enum TABS {
  ASSETS,
  VOWS,
  BONDS,
  DEBILITIES,
}

export function TabsSection(props: TabsSectionProps) {
  const { assets, characterId } = props;

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.ASSETS);
  return (
    <Card
      variant={"outlined"}
      sx={{ flexGrow: 1, mt: 2, display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={(evt, value) => setSelectedTab(value)}
        >
          <Tab label="Assets" value={TABS.ASSETS} />
          {/* <Tab label="Vows" />
          <Tab label="Bonds" />
          <Tab label="Debilities" />
          <Tab label="Combat" /> */}
        </Tabs>
      </Box>
      <Box
        flexGrow={1}
        overflow={"auto"}
        bgcolor={(theme) =>
          selectedTab === TABS.ASSETS ? theme.palette.grey[100] : undefined
        }
      >
        {selectedTab === TABS.ASSETS && assets && (
          <AssetsSection assetData={assets} characterId={characterId} />
        )}
      </Box>
    </Card>
  );
}
