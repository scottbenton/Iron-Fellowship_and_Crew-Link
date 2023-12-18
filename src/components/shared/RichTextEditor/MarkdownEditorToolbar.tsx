import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import BoldIcon from "@mui/icons-material/FormatBold";
import ItalicIcon from "@mui/icons-material/FormatItalic";
import StrikeThroughIcon from "@mui/icons-material/FormatStrikethrough";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BulletListIcon from "@mui/icons-material/FormatListBulleted";
import NumberedListIcon from "@mui/icons-material/FormatListNumbered";

export interface MarkdownEditorToolbarProps {
  editor: Editor | null;
}

export function MarkdownEditorToolbar(props: MarkdownEditorToolbarProps) {
  const { editor } = props;

  if (!editor) {
    return null;
  }

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
    </Box>
  );
}
