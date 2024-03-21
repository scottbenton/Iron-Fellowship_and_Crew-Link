import {
  Autocomplete,
  Box,
  ListItemText,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { Editor } from "@tiptap/react";
import BoldIcon from "@mui/icons-material/FormatBold";
import ItalicIcon from "@mui/icons-material/FormatItalic";
import StrikeThroughIcon from "@mui/icons-material/FormatStrikethrough";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BulletListIcon from "@mui/icons-material/FormatListBulleted";
import NumberedListIcon from "@mui/icons-material/FormatListNumbered";
import { useStore } from "stores/store";
import MovesIcon from "@mui/icons-material/DirectionsRun";
import { OracleIcon } from "assets/OracleIcon";
import { useState } from "react";

export interface MarkdownEditorToolbarProps {
  editor: Editor | null;
}

export function MarkdownEditorToolbar(props: MarkdownEditorToolbarProps) {
  const { editor } = props;

  const moveMap = useStore((store) => store.rules.moveMaps.moveMap);
  const oracleMap = useStore(
    (store) => store.rules.oracleMaps.oracleRollableMap
  );

  const [moveLinkPopoverParent, setMoveLinkPopoverParent] =
    useState<HTMLElement | null>(null);
  const [oracleLinkPopoverParent, setOracleLinkPopoverParent] =
    useState<HTMLElement | null>(null);

  if (!editor) {
    return null;
  }

  const autocompleteOptions: {
    id: string;
    type: "move" | "oracle";
    label: string;
  }[] = [];
  Object.values(moveMap).forEach((move) => {
    autocompleteOptions.push({
      id: move._id,
      type: "move",
      label: move.name,
    });
  });
  Object.values(oracleMap).forEach((oracle) => {
    autocompleteOptions.push({
      id: oracle._id,
      type: "oracle",
      label: oracle.name,
    });
  });

  const addDataswornLink = (id: string, label: string) => {
    setMoveLinkPopoverParent(null);
    setOracleLinkPopoverParent(null);

    editor.chain().focus().insertContent(label).run();

    const { from } = editor.state.selection;
    const startPos = from - label.length;
    const endPos = startPos + label.length;

    editor
      .chain()
      .setTextSelection({ from: startPos, to: endPos })
      .setLink({ href: `id:${id}` })
      .setTextSelection(endPos + 1)
      .focus()
      .run();
  };

  return (
    <Box
      display={"flex"}
      flexWrap={"wrap"}
      borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
      px={2}
      mt={-1}
      pb={1}
      position={"sticky"}
      top={0}
      bgcolor={(theme) => theme.palette.background.paper}
      zIndex={2}
    >
      <ToggleButtonGroup size={"small"} sx={{ mr: 1 }}>
        <Tooltip title={"Bold"} enterDelay={300}>
          <ToggleButton
            value={"bold"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            selected={editor.isActive("bold")}
          >
            <BoldIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title={"Italic"} enterDelay={300}>
          <ToggleButton
            value={"italic"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            selected={editor.isActive("italic")}
          >
            <ItalicIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title={"Strikethrough"} enterDelay={300}>
          <ToggleButton
            value={"strikethrough"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            selected={editor.isActive("strike")}
          >
            <StrikeThroughIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
      <ToggleButtonGroup size={"small"} sx={{ mr: 1 }}>
        <Tooltip title={"Bulleted List"} enterDelay={300}>
          <ToggleButton
            value={"bullet list"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            selected={editor.isActive("bulletList")}
          >
            <BulletListIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={"Numbered List"} enterDelay={300}>
          <ToggleButton
            value={"number list"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            selected={editor.isActive("orderedList")}
          >
            <NumberedListIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={"Horizontal Rule"} enterDelay={300}>
          <ToggleButton
            value={"horizontal rule"}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <HorizontalRuleIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
      <ToggleButtonGroup size={"small"} sx={{ mr: 1 }}>
        <Tooltip title={"Add Move Link"} enterDelay={300}>
          <ToggleButton
            value={"move link"}
            onClick={(evt) => setMoveLinkPopoverParent(evt.currentTarget)}
            selected={false}
          >
            <MovesIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={"Add Oracle Link"} enterDelay={300}>
          <ToggleButton
            value={"oracle link"}
            onClick={(evt) => setOracleLinkPopoverParent(evt.currentTarget)}
            selected={false}
          >
            <Box
              width={24}
              height={24}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <OracleIcon />
            </Box>
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
      <Popover
        id={"move-link-popover"}
        open={!!moveLinkPopoverParent}
        anchorEl={moveLinkPopoverParent}
        onClose={() => setMoveLinkPopoverParent(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box p={1}>
          <Autocomplete
            options={Object.values(moveMap)}
            getOptionKey={(option) => option._id}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label={"Moves"} sx={{ minWidth: 200 }} />
            )}
            renderOption={(props, option) => (
              <Box component={"li"} {...props}>
                <ListItemText primary={option.name} secondary={option._id} />
              </Box>
            )}
            onChange={(evt, value) => {
              value && addDataswornLink(value._id, value.name);
            }}
          />
        </Box>
      </Popover>
      <Popover
        id={"oracle-link-popover"}
        open={!!oracleLinkPopoverParent}
        anchorEl={oracleLinkPopoverParent}
        onClose={() => setOracleLinkPopoverParent(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box p={1}>
          <Autocomplete
            options={Object.values(oracleMap)}
            getOptionKey={(option) => option._id}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label={"Oracles"} sx={{ minWidth: 200 }} />
            )}
            renderOption={(props, option) => (
              <Box component={"li"} {...props}>
                <ListItemText primary={option.name} secondary={option._id} />
              </Box>
            )}
            onChange={(evt, value) => {
              value && addDataswornLink(value._id, value.name);
            }}
          />
        </Box>
      </Popover>
    </Box>
  );
}
