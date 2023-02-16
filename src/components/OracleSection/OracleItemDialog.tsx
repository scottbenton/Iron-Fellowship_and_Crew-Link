import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { OracleTable } from "types/Oracles.type";
import CloseIcon from "@mui/icons-material/Close";
import { MarkdownRenderer } from "components/MarkdownRenderer";

export interface OracleItemDialogProps {
  open: boolean;
  handleClose: () => void;

  name?: string;
  table?: OracleTable;

  handleRoll: () => void;
}

export function OracleItemDialog(props: OracleItemDialogProps) {
  const { open, handleClose, name, table, handleRoll } = props;

  return (
    <Dialog
      open={open && !!table && !!name}
      onClose={handleClose}
      maxWidth={"sm"}
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {name}
        <Box>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Button variant={"outlined"} onClick={() => handleRoll()}>
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
          </Box>
          <tbody>
            {table?.map((entry, index) => (
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
                  {index === 0 ? "1" : table[index - 1].chance + 1} -{" "}
                  {entry.chance}
                </Typography>
                <Typography
                  component={"td"}
                  px={1}
                  py={0.5}
                  variant={"body2"}
                  color={(theme) => theme.palette.grey[700]}
                >
                  <MarkdownRenderer inheritColor markdown={entry.description} />
                </Typography>
              </Box>
            ))}
          </tbody>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
