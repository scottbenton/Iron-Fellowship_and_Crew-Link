import { useEditor } from "@tiptap/react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { Editor } from "./Editor";
import { textboxAttributes } from "./textboxAttributes";
import { EditorToolbar } from "./EditorToolbar";
import { useStore } from "stores/store";
import { rtcExtensions } from "./rtcExtensions";

const NOTE_TEXT_LABEL = "Note text";

export interface RtcRichTextEditorProps {
  provider: WebrtcProvider;
  doc: Y.Doc;
  saving: boolean;
  withHeading?: boolean;
  readOnly?: boolean;
  deleteNote?: () => void;
  extraEditorActions?: React.ReactNode;
}

export function RtcEditorComponent(props: RtcRichTextEditorProps) {
  const {
    provider,
    doc,
    saving,
    withHeading,
    readOnly,
    deleteNote,
    extraEditorActions,
  } = props;

  const user = useStore((store) => store.auth.user);

  const editor = useEditor(
    {
      extensions: rtcExtensions({
        doc,
        provider,
        user,
        withHeading,
      }),
      editable: !readOnly,
      editorProps: { attributes: textboxAttributes(NOTE_TEXT_LABEL) },
    },
    [doc, provider, user, withHeading]
  );

  return (
    <Editor
      outlined={!withHeading}
      editable={!readOnly}
      editor={editor}
      saving={saving}
      label={NOTE_TEXT_LABEL}
      toolbar={
        editor &&
        !readOnly && (
          <EditorToolbar
            editor={editor}
            deleteNote={deleteNote}
            extraEditorActions={extraEditorActions}
          />
        )
      }
    />
  );
}
