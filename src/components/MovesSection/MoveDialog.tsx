import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { Move, ROLLABLES, ROLLABLE_TRACKS } from "types/Moves.type";
import CloseIcon from "@mui/icons-material/Close";
import { StatsMap } from "types/Character.type";
import { StatComponent } from "../StatComponent";
import { STATS } from "../../types/stats.enum";
import { useRoller } from "components/DieRollProvider";

export interface MoveDialogProps {
  move?: Move;
  handleClose: () => void;

  stats?: {
    health: number;
    spirit: number;
    supply: number;
  } & StatsMap;
}

const labels: { [key in ROLLABLES]: string } = {
  [STATS.EDGE]: "Edge",
  [STATS.HEART]: "Heart",
  [STATS.IRON]: "Iron",
  [STATS.SHADOW]: "Shadow",
  [STATS.WITS]: "Wits",
  [ROLLABLE_TRACKS.HEALTH]: "Health",
  [ROLLABLE_TRACKS.SPIRIT]: "Spirit",
  [ROLLABLE_TRACKS.SUPPLY]: "Supply",
};

export function MoveDialog(props: MoveDialogProps) {
  const { move, handleClose, stats } = props;
  const { oracle } = move || {};

  const { rollOracleTable } = useRoller();

  return (
    <Dialog open={!!move} onClose={() => handleClose()}>
      <DialogTitle display={"flex"} justifyContent={"space-between"}>
        <span>{move?.name}</span>
        <span>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </span>
      </DialogTitle>
      <DialogContent>
        {move?.stats && stats && (
          <Box display={"flex"} flexWrap={"wrap"}>
            {move.stats.map((stat, index) => (
              <StatComponent
                key={index}
                label={labels[stat]}
                value={stats[stat]}
                sx={{ mt: 1, mr: 1 }}
              />
            ))}
          </Box>
        )}
        {oracle && (
          <Button
            variant={"outlined"}
            color={"primary"}
            onClick={() =>
              rollOracleTable(undefined, move?.name ?? "", oracle.table)
            }
            sx={{ mt: move?.stats && stats ? 1 : 0 }}
          >
            Roll on the Oracle Table
          </Button>
        )}
        {move?.text && <MarkdownRenderer markdown={move?.text} />}
      </DialogContent>
    </Dialog>
  );
}
