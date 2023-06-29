import { ButtonBase, Typography, Box } from "@mui/material";
import PlusIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";

export interface ExperienceButtonsProps {
  label: string;
  handleAdd: () => void;
  handleSubtract: () => void;
}

export function ExperienceButtons(props: ExperienceButtonsProps) {
  const { label, handleAdd, handleSubtract } = props;

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      border={(theme) => `1px solid ${theme.palette.divider}`}
    >
      <ButtonBase
        sx={(theme) => ({
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        })}
        onClick={() => handleSubtract()}
      >
        <MinusIcon color={"action"} />
      </ButtonBase>
      <Typography sx={{ flexGrow: 1, px: 0.5 }} textAlign={"center"}>
        {label}
      </Typography>
      <ButtonBase
        sx={(theme) => ({
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        })}
        onClick={() => handleAdd()}
      >
        <PlusIcon color={"action"} />
      </ButtonBase>
    </Box>
  );
}
