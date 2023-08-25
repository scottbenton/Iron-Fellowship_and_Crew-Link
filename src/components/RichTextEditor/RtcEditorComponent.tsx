import { useEditor } from "@tiptap/react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { Editor } from "./Editor";
import { EditorToolbar } from "./EditorToolbar";
import { useStore } from "stores/store";
import { rtcExtensions } from "./rtcExtensions";
import { useEffect } from "react";

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
      editable: true,
    },
    [doc, provider, user, withHeading]
  );

  useEffect(() => {
    console.count("Provider Changed");
  }, [provider]);

  useEffect(() => {
    console.count("Doc Changed");
  }, [doc]);

  useEffect(() => {
    console.count("withHeading Changed");
  }, [withHeading]);

  useEffect(() => {
    console.count("deleteNote Changed");
  }, [deleteNote]);

  useEffect(() => {
    console.count("user Changed");
  }, [user]);

  useEffect(() => {
    console.count("Editor Changed");
  }, [editor]);

  useEffect(() => {
    console.count("Provider Changed");
  }, [provider]);
  console.debug("EDITOR COMPONENT RERENDERED");

  return (
    <Editor
      outlined
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
