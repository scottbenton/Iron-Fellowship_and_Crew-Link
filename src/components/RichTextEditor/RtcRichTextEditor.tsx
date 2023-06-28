import { useCallback, useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { RtcEditorComponent } from "./RtcEditorComponent";

export interface RtcRichTextEditorProps {
  id: string;
  roomPrefix: string;
  documentPassword: string;
  onSave: (
    documentId: string,
    notes: Uint8Array,
    isBeaconRequest?: boolean
  ) => Promise<boolean>;
  initialValue?: Uint8Array;
}

export function RtcRichTextEditor(props: RtcRichTextEditorProps) {
  const { id, roomPrefix, documentPassword, onSave, initialValue } = props;

  const [yDoc, setYDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<WebrtcProvider>();

  const hasUnsavedChangesRef = useRef<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);

  // TODO - call save whenever the document ID changes
  const handleSave = useCallback(
    (idToPass: string, notes: Uint8Array, isBeaconRequest?: boolean) => {
      setHasUnsavedChanges(false);
      hasUnsavedChangesRef.current = false;
      setSaving(true);
      onSave(idToPass, notes, isBeaconRequest)
        .catch(() => {})
        .finally(() => {
          setSaving(false);
        });
    },
    []
  );

  useEffect(() => {
    const roomName = roomPrefix + id;
    // Recreate our yDoc and Provider
    const newYDoc = new Y.Doc();
    if (initialValue) {
      Y.applyUpdate(newYDoc, initialValue);
    }

    // Add update listener
    newYDoc?.on("update", (message, origin) => {
      // Only on changes we make, to prevent overcrowding our backend
      if (!origin.peerId) {
        setHasUnsavedChanges(true);
        hasUnsavedChangesRef.current = true;
      }
    });

    const newProvider = new WebrtcProvider(roomName, newYDoc, {
      password: documentPassword,
    });

    setProvider(newProvider);
    setYDoc(newYDoc);
    setHasUnsavedChanges(false);
    setSaving(false);
    hasUnsavedChangesRef.current = false;

    return () => {
      if (hasUnsavedChangesRef.current && newYDoc) {
        handleSave(id, Y.encodeStateAsUpdate(newYDoc));
      }
      newYDoc?.destroy();
      newProvider?.destroy();
    };
  }, [roomPrefix, id, handleSave]);

  // Handle save on page unload
  useEffect(() => {
    const onUnloadFunction = () => {
      if (hasUnsavedChangesRef.current && yDoc) {
        handleSave(id, Y.encodeStateAsUpdate(yDoc), true);
        // Delay closing because firefox does not support keep-alive
        // NOTE - this is a bad way of handling this, but I can't find a better way to check support for keep alive
        if (navigator.userAgent?.includes("Mozilla")) {
          const time = Date.now();
          while (Date.now() - time < 500) {}
        }
      }
    };
    window.addEventListener("beforeunload", onUnloadFunction);

    return () => {
      window.removeEventListener("beforeunload", onUnloadFunction);
    };
  }, [handleSave, yDoc, id]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (yDoc && hasUnsavedChanges) {
      timeout = setTimeout(() => {
        const changes = Y.encodeStateAsUpdate(yDoc);
        handleSave(id, changes);
      }, 30 * 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [yDoc, hasUnsavedChanges, handleSave, id]);

  if (!yDoc || !provider) {
    return null;
  }

  return <RtcEditorComponent provider={provider} doc={yDoc} saving={saving} />;
}
