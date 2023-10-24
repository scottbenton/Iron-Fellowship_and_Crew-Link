import { useCallback, useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { RtcEditorComponent } from "./RtcEditorComponent";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { useCreateRefFrom } from "hooks/useCreateRefFrom";
import { firebaseAuth } from "config/firebase.config";

export interface RtcRichTextEditorProps {
  id: string;
  roomPrefix: string;
  documentPassword: string;
  onSave?: (
    documentId: string,
    notes: Uint8Array,
    isBeaconRequest?: boolean,
    title?: string
  ) => Promise<boolean | void>;
  onDelete?: (id: string) => void;
  initialValue?: Uint8Array;
  showTitle?: boolean;
}

export function RtcRichTextEditor(props: RtcRichTextEditorProps) {
  const {
    id,
    roomPrefix,
    documentPassword,
    onSave,
    onDelete,
    initialValue,
    showTitle,
  } = props;
  const initialValueRef = useCreateRefFrom(initialValue);

  const [yDoc, setYDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<WebrtcProvider>();

  const hasUnsavedChangesRef = useRef<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = useCallback(
    (idToPass: string, doc: Y.Doc, isBeaconRequest?: boolean) => {
      if (onSave) {
        const notes = Y.encodeStateAsUpdate(doc);
        const title = showTitle ? extractTitle(doc) : undefined;
        setHasUnsavedChanges(false);
        hasUnsavedChangesRef.current = false;
        setSaving(true);
        onSave(idToPass, notes, isBeaconRequest, title)
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            setSaving(false);
          });
      }
    },
    [showTitle, onSave]
  );

  useEffect(() => {
    const roomName = roomPrefix + id;
    // Recreate our yDoc and Provider
    const newYDoc = new Y.Doc();
    if (initialValueRef.current) {
      Y.applyUpdate(newYDoc, initialValueRef.current);
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
      signaling: ["wss://y-webrtc-signalling-server.onrender.com"],
    });

    setProvider(newProvider);
    setYDoc(newYDoc);
    setHasUnsavedChanges(false);
    setSaving(false);
    hasUnsavedChangesRef.current = false;

    return () => {
      if (hasUnsavedChangesRef.current && newYDoc) {
        handleSave(id, newYDoc);
      }
      newYDoc?.destroy();
      newProvider?.destroy();
    };
  }, [roomPrefix, id, handleSave]);

  // Handle save on page unload
  useEffect(() => {
    const onUnloadFunction = () => {
      if (
        document.visibilityState === "hidden" &&
        hasUnsavedChangesRef.current &&
        yDoc
      ) {
        handleSave(id, yDoc, true);
        // Delay closing because firefox does not support keep-alive
        // NOTE - this is a bad way of handling this, but I can't find a better way to check support for keep alive
        // if (navigator.userAgent?.includes("Mozilla")) {
        //   const time = Date.now();
        //   while (Date.now() - time < 500) {}
        // }
      }
    };
    document.addEventListener("visibilitychange", onUnloadFunction);

    return () => {
      document.removeEventListener("visibilitychange", onUnloadFunction);
    };
  }, [handleSave, yDoc, id]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (yDoc && hasUnsavedChanges) {
      firebaseAuth.currentUser?.getIdToken(true).then((token) => {
        window.sessionStorage.setItem("id-token", token);
      }); // Force refresh of token in case the user exits soon.
      timeout = setTimeout(() => {
        handleSave(id, yDoc);
      }, 30 * 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [yDoc, hasUnsavedChanges, handleSave, id]);

  useEffect(() => {
    if (!hasUnsavedChangesRef.current && yDoc && initialValue) {
      if (initialValue) {
        Y.applyUpdate(yDoc, initialValue, { peerId: "local" });
      }
    }
  }, [initialValue, yDoc, showTitle]);

  if (!yDoc || !provider) {
    return null;
  }

  return (
    <RtcEditorComponent
      readOnly={!onSave}
      provider={provider}
      doc={yDoc}
      saving={saving}
      deleteNote={onDelete ? () => onDelete(id) : undefined}
      withHeading={showTitle}
    />
  );
}

function extractTitle(doc: Y.Doc): string | undefined {
  const jsonContent = TiptapTransformer.fromYdoc(doc, "default");
  let currentNode = jsonContent.content?.[0];
  while (currentNode && !currentNode.text) {
    currentNode = currentNode.content?.[0];
  }
  return currentNode?.text ?? "Placeholder Title";
}
