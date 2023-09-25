import {
  Stack,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
} from "@mui/material";
import { SectionHeading } from "components/SectionHeading";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { CustomMovesSection } from "components/CustomMovesSection";
import { CustomOracleSection } from "components/CustomOraclesSection";
import { constructCharacterCardUrl } from "pages/Character/routes";
import { useStore } from "stores/store";
import { Debilities } from "./Debilities";
import { Stats } from "./Stats";
import { CharacterSettings } from "./CharacterSettings";

export function CharacterSection() {
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );

  const { success } = useSnackbar();

  const customMoves = useStore(
    (store) => store.settings.customMoves[store.auth.uid]
  );
  const hiddenMoveIds = useStore(
    (store) => store.settings?.hiddenCustomMoveIds
  );
  const showOrHideCustomMove = useStore(
    (store) => store.settings.toggleCustomMoveVisibility
  );

  const customOracles = useStore(
    (store) => store.settings.customOracles[store.auth.uid]
  );
  const hiddenOracleIds = useStore(
    (store) => store.settings?.hiddenCustomOracleIds
  );
  const showOrHideCustomOracle = useStore(
    (store) => store.settings.toggleCustomOracleVisibility
  );

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(
        window.location.origin + constructCharacterCardUrl(characterId ?? "")
      )
      .then(() => {
        success("Copied Link to Clipboard");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const shouldShowDelveMoves = useStore(
    (store) => store.settings.delve.showDelveMoves
  );
  const shouldShowDelveOracles = useStore(
    (store) => store.settings.delve.showDelveOracles
  );
  const updateSettings = useStore((store) => store.settings.updateSettings);

  return (
    <Stack spacing={2} pb={2}>
      <Debilities />
      <CharacterSettings />
      <Stats />

      {!campaignId && (
        <>
          <CustomMovesSection
            customMoves={customMoves}
            hiddenMoveIds={hiddenMoveIds}
            showOrHideCustomMove={showOrHideCustomMove}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={shouldShowDelveMoves}
                onChange={(evt, value) => {
                  updateSettings({ hideDelveMoves: !value }).catch(() => {});
                }}
              />
            }
            label={"Show Delve Moves?"}
            sx={{ px: 2 }}
          />
        </>
      )}
      {!campaignId && (
        <>
          <CustomOracleSection
            customOracles={customOracles}
            hiddenOracleIds={hiddenOracleIds}
            showOrHideCustomOracle={showOrHideCustomOracle}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={shouldShowDelveOracles}
                onChange={(evt, value) => {
                  updateSettings({ hideDelveOracles: !value }).catch(() => {});
                }}
              />
            }
            label={"Show Delve Oracles?"}
            sx={{ px: 2 }}
          />
        </>
      )}
      <SectionHeading label={"Misc"} />
      <Box px={2}>
        <Alert severity="info">
          <div>
            Iron Fellowship includes an overlay for OBS or other webcam editors
            so you can overlay information about your character as you play. You
            can add the given link as a browser source over your camera to
            display this information.
          </div>
          <Button
            onClick={() => copyLinkToClipboard()}
            color={"inherit"}
            variant={"outlined"}
            sx={{ mt: 1 }}
          >
            Copy link to Card Overlay for OBS
          </Button>
        </Alert>
      </Box>
    </Stack>
  );
}
