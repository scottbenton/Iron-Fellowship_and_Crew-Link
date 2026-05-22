import { DialogContent, IconButton, Tooltip } from "@mui/material";
import { LinkedDialogContentTitle } from "../LinkedDialogContentTitle";
import PinnedIcon from "@mui/icons-material/PushPin";
import { useStore } from "stores/store";
import { OracleRollableTable } from "./OracleRollableTable";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { OracleTableSharedRolls } from "./OracleTableSharedRolls";
import { OracleTableSharedResults } from "./OracleTableSharedResults";
import { OracleCollection } from "./OracleCollection";
import { OracleRollableColumn } from "./OracleRollableColumn";
import { OracleButton } from "components/features/charactersAndCampaigns/OracleSection/OracleButton";

export interface OracleDialogContentProps {
  id: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}

// TODO - remove once datasworn is correct
type TempType = {
  summary?: string;
  description?: string;
};

export function OracleDialogContent(props: OracleDialogContentProps) {
  const { id, handleBack, handleClose, isLastItem } = props;

  const oracles = useStore((store) => store.rules.oracleMaps.allOraclesMap);
  const oracle = oracles[id];

  const pinnedOracles = useStore((store) => store.settings.pinnedOraclesIds);
  const updatePinnedOracles = useStore(
    (store) => store.settings.togglePinnedOracle
  );

  if (!oracle) {
    return (
      <>
        <LinkedDialogContentTitle
          id={id}
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

  const pinned = !!pinnedOracles[id];

  return (
    <>
      <LinkedDialogContentTitle
        id={id}
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
        {oracle.name}
      </LinkedDialogContentTitle>
      <DialogContent>
        {(oracle as TempType).summary && !(oracle as TempType).description && (
          <MarkdownRenderer markdown={(oracle as TempType).summary ?? ""} />
        )}
        {(oracle as TempType).description && (
          <MarkdownRenderer markdown={(oracle as TempType).description ?? ""} />
        )}
        {oracle.oracle_type !== "table_shared_text" &&
          oracle.oracle_type !== "table_shared_text2" &&
          oracle.oracle_type !== "table_shared_text3" &&
          oracle.oracle_type !== "tables" && (
            <OracleButton
              oracleId={id}
              color={"inherit"}
              variant={"outlined"}
              sx={{ mt: 1 }}
            />
          )}
        {(oracle.oracle_type === "table_text" ||
          oracle.oracle_type === "table_text2" ||
          oracle.oracle_type === "table_text3") && (
          <OracleRollableTable oracle={oracle} />
        )}
        {(oracle.oracle_type === "column_text" ||
          oracle.oracle_type === "column_text2" ||
          oracle.oracle_type === "column_text3") && (
          <OracleRollableColumn oracle={oracle} />
        )}
        {oracle.oracle_type === "table_shared_rolls" && (
          <OracleTableSharedRolls oracle={oracle} />
        )}
        {(oracle.oracle_type === "table_shared_text" ||
          oracle.oracle_type === "table_shared_text2" ||
          oracle.oracle_type === "table_shared_text3") && (
          <OracleTableSharedResults oracle={oracle} />
        )}
        {oracle.oracle_type === "tables" && (
          <OracleCollection collection={oracle} />
        )}
      </DialogContent>
    </>
  );

  // const table = oracle.Table;
  // const pinned = !!pinnedOracles[id];

  // return (
  //   <>
  //       {oracle.Description && (
  //         <MarkdownRenderer markdown={oracle.Description} />
  //       )}
  //       <Button
  //         variant={"outlined"}
  //         color={"inherit"}
  //         onClick={() => rollOracleTable(id)}
  //       >
  //         Roll on the Table
  //       </Button>
  //       <Box
  //         component={"table"}
  //         mt={1}
  //         border={1}
  //         borderColor={(theme) => theme.palette.divider}
  //         borderRadius={(theme) => `${theme.shape.borderRadius}px`}
  //         sx={{ borderCollapse: "collapse" }}
  //         width={"100%"}
  //       >
  //         <Box
  //           component={"thead"}
  //           bgcolor={(theme) => theme.palette.background.paperInlayDarker}
  //         >
  //           <tr>
  //             <Typography
  //               component={"th"}
  //               variant={"body2"}
  //               textAlign={"left"}
  //               p={1}
  //               minWidth={"8ch"}
  //             >
  //               <b>Roll</b>
  //             </Typography>
  //             <Typography
  //               component={"th"}
  //               variant={"body2"}
  //               textAlign={"left"}
  //               p={1}
  //             >
  //               <b>Result</b>
  //             </Typography>
  //           </tr>
  //         </Box>
  //         <tbody>
  //           {table.map((entry, index) => {
  //             const { Floor, Ceiling, Result } = entry;

  //             if (Floor === null || Ceiling === null) {
  //               return null;
  //             }

  //             const diff = (Ceiling ?? 100) - (Floor ?? 1);

  //             return (
  //               <Box
  //                 key={index}
  //                 component={"tr"}
  //                 sx={(theme) => ({
  //                   "&:nth-of-type(even)": {
  //                     backgroundColor: theme.palette.background.paperInlay,
  //                   },
  //                 })}
  //               >
  //                 <Typography
  //                   component={"td"}
  //                   px={1}
  //                   py={0.5}
  //                   variant={"body2"}
  //                   color={(theme) => theme.palette.text.secondary}
  //                 >
  //                   {diff === 0 ? Floor : `${Floor} - ${Ceiling}`}
  //                 </Typography>
  //                 <Typography
  //                   component={"td"}
  //                   px={1}
  //                   py={0.5}
  //                   variant={"body2"}
  //                   color={(theme) => theme.palette.text.primary}
  //                 >
  //                   <MarkdownRenderer inheritColor markdown={Result} />
  //                 </Typography>
  //               </Box>
  //             );
  //           })}
  //         </tbody>
  //       </Box>
  //     </DialogContent>
  //   </>
  // );
}
