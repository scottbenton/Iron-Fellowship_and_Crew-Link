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
      alignItems={"stretch"}
      mr={1}
      mt={0.5}
      borderRadius={(theme) => `${theme.shape.borderRadius}px`}
      overflow={"hidden"}
    >
      <ButtonBase
        sx={(theme) => ({
          backgroundColor: theme.palette.darkGrey.main,
          color: theme.palette.darkGrey.contrastText,
          "&:hover": {
            backgroundColor: theme.palette.darkGrey.dark,
          },
        })}
        onClick={() => handleSubtract()}
      >
        <MinusIcon />
      </ButtonBase>
      <Typography
        sx={{ flexGrow: 1, px: 1 }}
        borderTop={(theme) => `1px solid ${theme.palette.divider}`}
        borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
        textAlign={"center"}
      >
        {label}
      </Typography>
      <ButtonBase
        sx={(theme) => ({
          backgroundColor: theme.palette.darkGrey.main,
          color: theme.palette.darkGrey.contrastText,
          "&:hover": {
            backgroundColor: theme.palette.darkGrey.dark,
          },
        })}
        onClick={() => handleAdd()}
      >
        <PlusIcon />
      </ButtonBase>
    </Box>
  );
}
