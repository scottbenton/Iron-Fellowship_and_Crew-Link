import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { Editor } from "./Editor";
import { EditorToolbar } from "./EditorToolbar";
import { useAuth } from "providers/AuthProvider";
import { getHSLFromString } from "functions/getHueFromString";

export interface RtcRichTextEditorProps {
  provider: WebrtcProvider;
  doc: Y.Doc;
}

export function RtcEditorComponent(props: RtcRichTextEditorProps) {
  const { provider, doc } = props;

  const user = useAuth().user;
  const [saving, setSaving] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({ document: doc }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: user?.displayName ?? "Unknown User",
          color: user ? getHSLFromString(user.uid, 70, 80) : "#d0d0d0",
        },
      }),
    ],
    editable: true,
  });

  return (
    <Editor
      outlined
      editable
      editor={editor}
      saving={false}
      toolbar={editor && <EditorToolbar editor={editor} />}
    />
  );
}
