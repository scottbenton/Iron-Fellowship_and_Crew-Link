import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useRoller } from "stores/appState/useRoller";
import { parseDiceExpression } from "stores/appState/rollers/diceExpressionParser";

const DIE_OPTIONS = [4, 6, 8, 10, 12, 20, 100];

export function CustomDiceRollerButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dieSides, setDieSides] = useState<string>("6");
  const [quantity, setQuantity] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [customNotation, setCustomNotation] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const { rollCustomDice } = useRoller();

  const builtNotation = `${quantity}d${dieSides}${
    modifier > 0 ? "+" + modifier : modifier < 0 ? modifier : ""
  }`;

  const notation = isCustomMode ? customNotation : builtNotation;
  const parsedCustom = isCustomMode ? parseDiceExpression(customNotation) : null;
  const canRoll = isCustomMode ? !!parsedCustom : !!dieSides;
  const isInvalidCustom = isCustomMode && !!customNotation && !parsedCustom;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchToCustom = () => {
    setCustomNotation(builtNotation);
    setIsCustomMode(true);
  };

  const handleSwitchToBuilder = () => {
    const parsed = parseDiceExpression(customNotation);
    if (parsed && DIE_OPTIONS.includes(parsed.typeOfDice)) {
      setDieSides(String(parsed.typeOfDice));
      setQuantity(parsed.diceCount);
      setModifier(parsed.modifier);
    }
    setIsCustomMode(false);
  };

  const handleRoll = async () => {
    if (!canRoll) return;
    await rollCustomDice(notation);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        color="inherit"
        aria-label="Roll Custom Dice"
        startIcon={<CasinoIcon />}
        variant="outlined"
        fullWidth
      >
        Roll Custom Dice
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        slotProps={{ paper: { sx: { p: 2, minWidth: 300, maxWidth: 340 } } }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Custom Dice Roll
        </Typography>

        {!isCustomMode ? (
          <>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
            >
              Die Type
            </Typography>
            <ToggleButtonGroup
              value={dieSides}
              exclusive
              onChange={(_, val) => val && setDieSides(val)}
              size="small"
              sx={{ flexWrap: "wrap", mb: 1.5 }}
            >
              {DIE_OPTIONS.map((d) => (
                <ToggleButton key={d} value={String(d)} sx={{ minWidth: 44 }}>
                  d{d}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Box display="flex" gap={3} mb={1.5}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Quantity
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography minWidth={20} textAlign="center">
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Modifier
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => setModifier((m) => m - 1)}
                    aria-label="Decrease modifier"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography minWidth={24} textAlign="center">
                    {modifier >= 0 ? `+${modifier}` : modifier}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setModifier((m) => m + 1)}
                    aria-label="Increase modifier"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Notation: <strong>{builtNotation}</strong>
            </Typography>
          </>
        ) : (
          <TextField
            fullWidth
            label="Dice Notation"
            placeholder="e.g. 2d20+3"
            value={customNotation}
            onChange={(e) => setCustomNotation(e.target.value)}
            size="small"
            error={isInvalidCustom}
            helperText={
              isInvalidCustom ? "Invalid notation (e.g. 2d20+3)" : " "
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && canRoll) handleRoll();
            }}
            autoFocus
          />
        )}

        <Divider sx={{ my: 1.5 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            size="small"
            onClick={isCustomMode ? handleSwitchToBuilder : handleSwitchToCustom}
          >
            {isCustomMode ? "Use Builder" : "Custom..."}
          </Button>
          <Button
            variant="contained"
            disabled={!canRoll}
            onClick={handleRoll}
            startIcon={<CasinoIcon />}
          >
            Roll
          </Button>
        </Box>
      </Popover>
    </>
  );
}
