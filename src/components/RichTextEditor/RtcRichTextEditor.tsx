import { useCallback, useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { RtcEditorComponent } from "./RtcEditorComponent";

export interface RtcRichTextEditorProps {
  documentId: string;
  documentPassword: string;
  onSave: (notes: Uint8Array, isBeaconRequest?: boolean) => Promise<boolean>;
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

  const handleSave = useCallback(
    (notes: Uint8Array, isBeaconRequest?: boolean) => {
      setHasUnsavedChanges(false);
      setSaving(true);
      onSave(notes, isBeaconRequest)
        .catch(() => {})
        .finally(() => {
          setSaving(false);
        });
    },
    []
  );

  useEffect(() => {
    if (
      provider?.roomName !== documentId &&
      documentId !== lastUpdatedRef.current
    ) {
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
    const onUnloadFunction = () => {
      if (hasUnsavedChanges && yDoc) {
        handleSave(Y.encodeStateAsUpdate(yDoc), true);

        // Delay closing because firefox does not support keep-alive
        // NOTE - this is a bad way of handling this, but I can't find a better way to check support for keep alive
        if (navigator.userAgent?.includes("Mozilla")) {
          const time = Date.now();
          while (Date.now() - time < 500) {}
        }
      }
    };

    let timeout: NodeJS.Timeout;
    if (yDoc && hasUnsavedChanges) {
      timeout = setTimeout(() => {
        const changes = Y.encodeStateAsUpdate(yDoc);
        handleSave(changes);
      }, 30 * 1000);
    }

    window.addEventListener("beforeunload", onUnloadFunction);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("beforeunload", onUnloadFunction);
      if (yDoc && hasUnsavedChanges) {
        const notes = Y.encodeStateAsUpdate(yDoc);
        handleSave(notes);
      }
    };
  }, [hasUnsavedChanges, yDoc, handleSave]);

  useEffect(() => {
    return () => {
      provider?.destroy();
      yDoc?.destroy();
    };
  }, [provider, yDoc]);

  if (!yDoc || !provider) {
    return null;
  }

  return <RtcEditorComponent provider={provider} doc={yDoc} saving={saving} />;
}
