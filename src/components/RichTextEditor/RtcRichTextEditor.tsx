import { useCallback, useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { RtcEditorComponent } from "./RtcEditorComponent";

export interface RtcRichTextEditorProps {
  documentId: string;
  documentPassword: string;
  onSave: (notes: string) => Promise<boolean>;
}

export function RtcRichTextEditor(props: RtcRichTextEditorProps) {
  const { documentId, documentPassword, onSave } = props;

  const [yDoc, setYDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<WebrtcProvider>();
  const lastUpdatedRef = useRef<string>();
  const hasDocChangedRef = useRef<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = useCallback((notes: string) => {
    setSaving(true);
    onSave(notes)
      .catch(() => {})
      .finally(() => setSaving(false));
  }, []);

  useEffect(() => {
    if (
      provider?.roomName !== documentId &&
      documentId !== lastUpdatedRef.current
    ) {
      console.debug("CREATING NEW PROVIDER");
      lastUpdatedRef.current = documentId;
      const yDoc = new Y.Doc();
      yDoc.on("update", () => {
        console.debug("DOC UPDATED");
        hasDocChangedRef.current = true;
      });
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

  useEffect(() => {
    // TODO - add update here to persist changes to the db
  }, []);

  if (!yDoc || !provider) {
    return null;
  }

  return <RtcEditorComponent provider={provider} doc={yDoc} saving={saving} />;
}
