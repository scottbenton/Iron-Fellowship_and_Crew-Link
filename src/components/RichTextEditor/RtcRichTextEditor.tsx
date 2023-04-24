import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { Editor } from "./Editor";
import { EditorToolbar } from "./EditorToolbar";
import { useAuth } from "providers/AuthProvider";
import { getHueFromString } from "functions/getHueFromString";
import { RtcEditorComponent } from "./RtcEditorComponent";

export interface RtcRichTextEditorProps {
  documentId: string;
  documentPassword: string;
}

export function RtcRichTextEditor(props: RtcRichTextEditorProps) {
  const { documentId, documentPassword } = props;

  const [yDoc, setYDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<WebrtcProvider>();
  const lastUpdatedRef = useRef<string>();

  useEffect(() => {
    if (
      provider?.roomName !== documentId &&
      documentId !== lastUpdatedRef.current
    ) {
      console.debug("CREATING NEW PROVIDER");
      lastUpdatedRef.current = documentId;
      const yDoc = new Y.Doc();
      setProvider(
        new WebrtcProvider(documentId, yDoc, {
          password: documentPassword,
        })
      );
      setYDoc(yDoc);
    }
  }, [documentId, documentPassword, provider]);

  useEffect(() => {
    return () => {
      provider?.destroy();
    };
  }, [provider]);

  if (!yDoc || !provider) {
    return null;
  }

  return <RtcEditorComponent provider={provider} doc={yDoc} />;
}
