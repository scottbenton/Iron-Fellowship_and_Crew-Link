import {
  Box,
  ButtonBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useId, useRef, useState } from "react";
import { ROLL_TYPE, Roll } from "types/DieRolls.type";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import CopyIcon from "@mui/icons-material/CopyAll";
import { getRollResultLabel } from "./getRollResultLabel";
import { useSnackbar } from "providers/SnackbarProvider";
import { convertRollToClipboard } from "./clipboardFormatter";

export interface NormalRollActionsProps {
  roll: Roll;
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
  const id = useId();
  const blockQuoteId = `roll-action-copy-${id}`;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuParent = useRef<HTMLButtonElement>(null);

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

  let rollTitle = roll.rollLabel;
  let actionContents: string | undefined = undefined;
  let challengeContents: string | undefined = undefined;
  let result: string | undefined = undefined;

  if (roll.type === ROLL_TYPE.STAT) {
    if (roll.moveName) {
      rollTitle = `${roll.moveName} (${roll.rollLabel})`;
    }

    const rollTotal = roll.action + (roll.modifier ?? 0) + (roll.adds ?? 0);
    actionContents = roll.action + "";
    if (roll.modifier || roll.adds) {
      actionContents +=
        (roll.modifier ? ` + ${roll.modifier}` : "") +
        (roll.adds ? ` + ${roll.adds}` : "") +
        ` = ${rollTotal > 10 ? "10 (Max)" : rollTotal}`;
    }

    challengeContents = roll.challenge1 + ", " + roll.challenge2;

    result = getRollResultLabel(roll.result).toLocaleUpperCase();
  }

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
        </Menu>
      )}
      {/* Copy to clipboard component */}
      <Box component={"blockquote"} display={"none"} id={blockQuoteId}>
        <p>{rollTitle}</p>
        {actionContents && (
          <p>
            <em>Action:</em> {actionContents}
          </p>
        )}
        {challengeContents && (
          <p>
            <em>Challenge:</em> {challengeContents}
          </p>
        )}
        {result && (
          <p>
            <b>{result}</b>
          </p>
        )}
      </Box>
    </>
  );
}
