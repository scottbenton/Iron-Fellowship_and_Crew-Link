import {
  ButtonBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRef, useState } from "react";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import CopyIcon from "@mui/icons-material/CopyAll";
import RerollIcon from "@mui/icons-material/Casino";
import { useSnackbar } from "providers/SnackbarProvider";
import { convertRollToClipboard } from "./clipboardFormatter";
import { RollWithId } from "stores/gameLog/gameLog.slice.type";
import { DieRerollDialog } from "./DieRerollDialog";
import { ROLL_TYPE } from "types/DieRolls.type";

export interface NormalRollActionsProps {
  roll: RollWithId;
}

async function pasteRich(rich: string, plain: string) {
  if (typeof ClipboardItem !== "undefined") {
    // Shiny new Clipboard API, not fully supported in Firefox.
    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#browser_compatibility
    const html = new Blob([rich], { type: "text/html" });
    const text = new Blob([plain], { type: "text/plain" });
    const data = new ClipboardItem({ "text/html": html, "text/plain": text });
    await navigator.clipboard.write([data]);
  } else {
    // Fallback using the deprecated `document.execCommand`.
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#browser_compatibility
    const cb = (e: ClipboardEvent) => {
      e.clipboardData?.setData("text/html", rich);
      e.clipboardData?.setData("text/plain", plain);
      e.preventDefault();
    };
    document.addEventListener("copy", cb);
    document.execCommand("copy");
    document.removeEventListener("copy", cb);
  }
}

export function NormalRollActions(props: NormalRollActionsProps) {
  const { roll } = props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuParent = useRef<HTMLButtonElement>(null);
  const [isDieRerollDialogOpen, setIsDieRerollDialogOpen] = useState(false);

  const { error, success } = useSnackbar();

  const handleCopyRoll = () => {
    const clipboardData = convertRollToClipboard(roll);

    if (clipboardData) {
      pasteRich(clipboardData.rich, clipboardData.plain)
        .then(() => {
          success("Copied roll to clipboard.");
        })
        .catch(() => {
          error("Failed to copy roll");
        });
    } else {
      error("Copying this roll type is not supported");
    }
  };

  return (
    <>
      <ButtonBase
        aria-label={"Roll Menu"}
        ref={menuParent}
        onClick={(evt) => {
          evt.stopPropagation();
          setIsMenuOpen(true);
        }}
      >
        <MoreIcon />
      </ButtonBase>
      {isMenuOpen && (
        <Menu
          sx={{
            zIndex: 10001,
          }}
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          anchorEl={menuParent.current}
        >
          <MenuItem
            onClick={(evt) => {
              evt.stopPropagation();
              handleCopyRoll();
              setIsMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <CopyIcon />
            </ListItemIcon>
            <ListItemText>Copy Roll Result</ListItemText>
          </MenuItem>
          {roll.type === ROLL_TYPE.STAT && (
            <MenuItem
              onClick={(evt) => {
                evt.stopPropagation();
                setIsMenuOpen(false);
                setIsDieRerollDialogOpen(true);
              }}
            >
              <ListItemIcon>
                <RerollIcon />
              </ListItemIcon>
              <ListItemText>Reroll Die</ListItemText>
            </MenuItem>
          )}
        </Menu>
      )}
      {roll.type === ROLL_TYPE.STAT && (
        <DieRerollDialog
          open={isDieRerollDialogOpen}
          handleClose={() => setIsDieRerollDialogOpen(false)}
          roll={roll}
        />
      )}
    </>
  );
}
