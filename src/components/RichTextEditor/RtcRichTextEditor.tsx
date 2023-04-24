import { useCallback, useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import { Buffer } from "buffer";
import * as Y from "yjs";

import { RtcEditorComponent } from "./RtcEditorComponent";

export interface RtcRichTextEditorProps {
  documentId: string;
  documentPassword: string;
  onSave: (notes: Uint8Array) => Promise<boolean>;
  initialValue?: Uint8Array;
}

export function RtcRichTextEditor(props: RtcRichTextEditorProps) {
  const { documentId, documentPassword, onSave, initialValue } = props;

  const [yDoc, setYDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<WebrtcProvider>();
  const lastUpdatedRef = useRef<string>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const initialValueRef = useRef<Uint8Array | undefined>(initialValue);

  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (
      provider?.roomName !== documentId &&
      documentId !== lastUpdatedRef.current
    ) {
      console.debug("CREATING NEW PROVIDER");
      lastUpdatedRef.current = documentId;

      const yDoc = new Y.Doc();
      if (initialValueRef.current) {
        Y.applyUpdate(yDoc, initialValueRef.current);
      }
      yDoc.on("update", (message, origin) => {
        if (!origin.peerId) {
          setHasUnsavedChanges(true);
        }
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
      yDoc?.destroy();
      provider?.destroy();
    };
  }, [provider, yDoc]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (yDoc && hasUnsavedChanges) {
      timeout = setTimeout(() => {
        const changes = Y.encodeStateAsUpdate(yDoc);
        setHasUnsavedChanges(false);
        setSaving(true);
        console.debug("SAVING");
        onSave(changes)
          .catch(() => {})
          .finally(() => {
            setSaving(false);
          });
      }, 30 * 1000);
    }
    // TODO - add update here to persist changes to the db
    return () => {
      clearTimeout(timeout);
    };
  }, [hasUnsavedChanges, yDoc]);

  if (!yDoc || !provider) {
    return null;
  }

  return <RtcEditorComponent provider={provider} doc={yDoc} saving={saving} />;
}
