import { Box, Fab } from "@mui/material";
import { OracleDrawer } from "components/features/charactersAndCampaigns/OracleDrawer";
import { MoveDrawer } from "components/features/charactersAndCampaigns/MoveDrawer";
import { useCallback, useState } from "react";
import MovesIcon from "@mui/icons-material/DirectionsRun";
import { OracleIcon } from "assets/OracleIcon";
import { useStore } from "stores/store";

export function CharacterHeaderMoveOracleButtons() {
  const [isMoveSidebarOpen, setIsMoveSidebarOpen] = useState(false);
  const closeMoveSidebar = useCallback(() => {
    setIsMoveSidebarOpen(false);
  }, []);
  const [isOracleSidebarOpen, setIsOracleSidebarOpen] = useState(false);
  const closeOracleSidebar = useCallback(() => {
    setIsOracleSidebarOpen(false);
  }, []);

  const shouldShowOracles = useStore((store) => {
    const currentCharacter = store.characters.currentCharacter.currentCharacter;

    if (currentCharacter) {
      return currentCharacter.campaignId
        ? store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
            store.auth.uid
          ) ?? false
        : true;
    }
    return true;
  });

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={{
          xs: shouldShowOracles ? "center" : "flex-start",
          sm: "flex-start",
        }}
        gap={2}
        mt={-4}
      >
        <Fab
          variant={"extended"}
          color={"primary"}
          sx={{ borderRadius: 4 }}
          onClick={() => setIsMoveSidebarOpen(true)}
        >
          <MovesIcon sx={{ mr: 1 }} />
          Moves
        </Fab>
        {shouldShowOracles && (
          <Fab
            variant={"extended"}
            color={"primary"}
            sx={{ borderRadius: 4 }}
            onClick={() => setIsOracleSidebarOpen(true)}
          >
            <OracleIcon sx={{ mr: 1 }} />
            Oracles
          </Fab>
        )}
      </Box>
      <MoveDrawer open={isMoveSidebarOpen} onClose={closeMoveSidebar} />
      <OracleDrawer open={isOracleSidebarOpen} onClose={closeOracleSidebar} />
    </>
  );
}
