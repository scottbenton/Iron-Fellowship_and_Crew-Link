import { Box, Button, DialogContent, Typography } from "@mui/material";
import { MarkdownRenderer } from "components/MarkdownRenderer";
import { useCustomOracles } from "components/OracleSection/useCustomOracles";
import { oracleMap } from "data/oracles";
import { useRoller } from "providers/DieRollProvider";
import { LinkedDialogContentTitle } from "./LinkedDialogContentTitle";

export interface OracleDialogContentProps {
  id: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}

export function OracleDialogContent(props: OracleDialogContentProps) {
  const { id, handleBack, handleClose, isLastItem } = props;

  const { rollOracleTable } = useRoller();

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
        <DialogContent>Sorry, we could not find that move.</DialogContent>
      </>
    );
  }

  const table = oracle.Table;

  return (
    <>
      <LinkedDialogContentTitle
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      >
        {oracle.Title.Short}
      </LinkedDialogContentTitle>
      <DialogContent>
        {oracle.Description && (
          <MarkdownRenderer markdown={oracle.Description} />
        )}
        <Button variant={"outlined"} onClick={() => rollOracleTable(id)}>
          Roll on the Table
        </Button>
        <Box
          component={"table"}
          mt={1}
          border={1}
          borderColor={(theme) => theme.palette.divider}
          borderRadius={(theme) => theme.shape.borderRadius}
          sx={{ borderCollapse: "collapse" }}
          width={"100%"}
        >
          <Box component={"thead"} bgcolor={(theme) => theme.palette.grey[200]}>
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

              const diff = (Ceiling ?? 100) - (Floor ?? 1);

              return (
                <Box
                  key={index}
                  component={"tr"}
                  sx={(theme) => ({
                    "&:nth-of-type(even)": {
                      backgroundColor: theme.palette.grey[100],
                    },
                  })}
                >
                  <Typography
                    component={"td"}
                    px={1}
                    py={0.5}
                    variant={"body2"}
                    color={(theme) => theme.palette.grey[700]}
                  >
                    {diff === 0 ? Floor : `${Floor} - ${Ceiling}`}
                  </Typography>
                  <Typography
                    component={"td"}
                    px={1}
                    py={0.5}
                    variant={"body2"}
                    color={(theme) => theme.palette.grey[700]}
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
