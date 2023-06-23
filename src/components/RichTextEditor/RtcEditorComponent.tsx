import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { Editor } from "./Editor";
import { EditorToolbar } from "./EditorToolbar";
import { useAuth } from "providers/AuthProvider";
import { getHueFromString, hslToHex } from "functions/getHueFromString";

export interface RtcRichTextEditorProps {
  provider: WebrtcProvider;
  doc: Y.Doc;
  saving: boolean;
}

export function RtcEditorComponent(props: RtcRichTextEditorProps) {
  const { provider, doc, saving } = props;

  const user = useAuth().user;

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Collaboration.configure({ document: doc }),
        CollaborationCursor.configure({
          provider: provider,
          user: {
            name: user?.displayName ?? "Unknown User",
            color: user
              ? hslToHex(getHueFromString(user.uid), 70, 80)
              : "#d0d0d0",
          },
        }),
      ],
      editable: true,
    },
    [doc, user]
  );

  return (
    <Editor
      outlined
      editable
      editor={editor}
      saving={saving}
      toolbar={editor && <EditorToolbar editor={editor} />}
    />
  );
}
