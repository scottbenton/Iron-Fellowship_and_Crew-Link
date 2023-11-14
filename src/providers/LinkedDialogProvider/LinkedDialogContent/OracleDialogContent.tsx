import {
  Box,
  Button,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { useCustomOracles } from "components/features/charactersAndCampaigns/OracleSection/useCustomOracles";
import { oracleMap } from "data/oracles";
import { useRoller } from "providers/DieRollProvider";
import { LinkedDialogContentTitle } from "./LinkedDialogContentTitle";
import { getIsLocalEnvironment } from "functions/getGameSystem";
import PinnedIcon from "@mui/icons-material/PushPin";
import { useStore } from "stores/store";

export interface OracleDialogContentProps {
  id: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}

export function OracleDialogContent(props: OracleDialogContentProps) {
  const { id, handleBack, handleClose, isLastItem } = props;

  const { rollOracleTable } = useRoller();

  const pinnedOracles = useStore((store) => store.settings.pinnedOraclesIds);
  const updatePinnedOracles = useStore(
    (store) => store.settings.togglePinnedOracle
  );

  const { allCustomOracleMap } = useCustomOracles();
  const oracle = oracleMap[id] ?? allCustomOracleMap?.[id];

  if (!oracle) {
    return (
      <>
        <LinkedDialogContentTitle
          handleBack={handleBack}
          handleClose={handleClose}
          isLastItem={isLastItem}
        >
          Oracle Not Found
        </LinkedDialogContentTitle>
        <DialogContent>Sorry, we could not find that oracle.</DialogContent>
      </>
    );
  }

  const table = oracle.Table;
  const pinned = !!pinnedOracles[id];

  return (
    <>
      <LinkedDialogContentTitle
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
        actions={
          <Tooltip title={pinned ? "Unpin Oracle" : "Pin Oracle"}>
            <IconButton
              color={pinned ? "primary" : "default"}
              onClick={() => updatePinnedOracles(id, !pinned).catch(() => {})}
            >
              <PinnedIcon />
            </IconButton>
          </Tooltip>
        }
      >
        {oracle.Title.Short}
      </LinkedDialogContentTitle>
      <DialogContent>
        {getIsLocalEnvironment() && <Typography>{id}</Typography>}
        {oracle.Description && (
          <MarkdownRenderer markdown={oracle.Description} />
        )}
        <Button
          variant={"outlined"}
          color={"inherit"}
          onClick={() => rollOracleTable(id)}
        >
          Roll on the Table
        </Button>
        <Box
          component={"table"}
          mt={1}
          border={1}
          borderColor={(theme) => theme.palette.divider}
          borderRadius={(theme) => `${theme.shape.borderRadius}px`}
          sx={{ borderCollapse: "collapse" }}
          width={"100%"}
        >
          <Box
            component={"thead"}
            bgcolor={(theme) => theme.palette.background.paperInlayDarker}
          >
            <tr>
              <Typography
                component={"th"}
                variant={"body2"}
                textAlign={"left"}
                p={1}
                minWidth={"8ch"}
              >
                <b>Roll</b>
              </Typography>
              <Typography
                component={"th"}
                variant={"body2"}
                textAlign={"left"}
                p={1}
              >
                <b>Result</b>
              </Typography>
            </tr>
          </Box>
          <tbody>
            {table.map((entry, index) => {
              const { Floor, Ceiling, Result } = entry;

              if (Floor === null || Ceiling === null) {
                return null;
              }

              const diff = (Ceiling ?? 100) - (Floor ?? 1);

              return (
                <Box
                  key={index}
                  component={"tr"}
                  sx={(theme) => ({
                    "&:nth-of-type(even)": {
                      backgroundColor: theme.palette.background.paperInlay,
                    },
                  })}
                >
                  <Typography
                    component={"td"}
                    px={1}
                    py={0.5}
                    variant={"body2"}
                    color={(theme) => theme.palette.text.secondary}
                  >
                    {diff === 0 ? Floor : `${Floor} - ${Ceiling}`}
                  </Typography>
                  <Typography
                    component={"td"}
                    px={1}
                    py={0.5}
                    variant={"body2"}
                    color={(theme) => theme.palette.text.primary}
                  >
                    <MarkdownRenderer inheritColor markdown={Result} />
                  </Typography>
                </Box>
              );
            })}
          </tbody>
        </Box>
      </DialogContent>
    </>
  );
}
