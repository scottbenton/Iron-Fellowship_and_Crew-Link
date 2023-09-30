import { useEditor } from "@tiptap/react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { Editor } from "./Editor";
import { EditorToolbar } from "./EditorToolbar";
import { useStore } from "stores/store";
import { rtcExtensions } from "./rtcExtensions";

export interface RtcRichTextEditorProps {
  provider: WebrtcProvider;
  doc: Y.Doc;
  saving: boolean;
  withHeading?: boolean;
  readOnly?: boolean;
  deleteNote?: () => void;
}

export function RtcEditorComponent(props: RtcRichTextEditorProps) {
  const { provider, doc, saving, withHeading, readOnly, deleteNote } = props;

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
    },
    [doc, provider, user, withHeading]
  );

  return (
    <Editor
      outlined={!withHeading}
      editable={!readOnly}
      editor={editor}
      saving={saving}
      toolbar={
        editor &&
        !readOnly && <EditorToolbar editor={editor} deleteNote={deleteNote} />
      }
    />
  );
}
