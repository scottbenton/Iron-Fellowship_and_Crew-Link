import { Editor } from "@tiptap/react";
import React from "react";
import { Select, MenuItem, TextField, SxProps } from "@mui/material";

export interface TextTypeDropdownProps {
  editor: Editor;
  sx?: SxProps;
}

enum TEXT_TYPES {
  heading1 = "h1",
  heading2 = "h2",
  heading3 = "h3",
  heading4 = "h4",
  heading5 = "h5",
  paragraph = "p",
}

const textLabels = {
  [TEXT_TYPES.heading1]: "Heading 1",
  [TEXT_TYPES.heading2]: "Heading 2",
  [TEXT_TYPES.heading3]: "Heading 3",
  [TEXT_TYPES.heading4]: "Heading 4",
  [TEXT_TYPES.heading5]: "Heading 5",
  [TEXT_TYPES.paragraph]: "Normal Text",
};

export const TextTypeDropdown: React.FC<TextTypeDropdownProps> = (props) => {
  const { editor, sx } = props;

  const getActiveTextType = () => {
    if (editor.isActive("heading", { level: 1 })) return TEXT_TYPES.heading1;
    if (editor.isActive("heading", { level: 2 })) return TEXT_TYPES.heading2;
    if (editor.isActive("heading", { level: 3 })) return TEXT_TYPES.heading3;
    if (editor.isActive("heading", { level: 4 })) return TEXT_TYPES.heading4;
    if (editor.isActive("heading", { level: 5 })) return TEXT_TYPES.heading5;

    return TEXT_TYPES.paragraph;
  };

  const setActiveTextType = (type: TEXT_TYPES) => {
    switch (type) {
      case TEXT_TYPES.heading1:
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case TEXT_TYPES.heading2:
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case TEXT_TYPES.heading3:
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case TEXT_TYPES.heading4:
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      case TEXT_TYPES.heading5:
        editor.chain().focus().toggleHeading({ level: 5 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
    }
  };

  return (
    <>
      <TextField
        value={getActiveTextType()}
        select
        label="Text Type"
        onChange={(evt) => setActiveTextType(evt.target.value as TEXT_TYPES)}
        variant={"outlined"}
        margin={"none"}
        sx={[{ width: "140px", mr: 1 }, ...(Array.isArray(sx) ? sx : [sx])]}
        SelectProps={{
          SelectDisplayProps: {
            style: { paddingTop: 0, paddingBottom: 0 },
          },
          sx: {
            height: "100%",
          },
        }}
      >
        {Object.keys(textLabels).map((key, index) => (
          <MenuItem key={index} value={key}>
            {textLabels[key as keyof typeof textLabels]}
          </MenuItem>
        ))}
      </TextField>
      {/* <Popover as={"div"} className={"relative inline-block z-50"}>
        <div>
          <Popover.Button
            className={
              "p-2 text-sm flex items-center btn rounded-none normal-case w-36 justify-between text-gray-700 hover:bg-gray-200"
            }
          >
            {textLabels[getActiveTextType()]}
            <MenuOpenIcon className={"w-5 h-5"} />
          </Popover.Button>
        </div>
        <Popover.Panel className={"menu-surface w-full"}>
          {Object.keys(textLabels).map((key, index) => (
            <button
              className={clsx("menu-item")}
              onClick={(evt) => setActiveTextType(evt, key as TEXT_TYPES)}
              key={index}
            >
              {textLabels[key as keyof typeof textLabels]}
            </button>
          ))}
        </Popover.Panel>
      </Popover> */}
    </>
  );
};
