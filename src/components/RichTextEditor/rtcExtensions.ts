import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import StarterKit from "@tiptap/starter-kit";
import { User } from "firebase/auth";
import { getHueFromString, hslToHex } from "functions/getHueFromString";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import { Extensions } from "@tiptap/react";

const CustomDocument = Document.extend({
  content: "heading block*",
});

export const rtcExtensions = (params: {
  doc?: Y.Doc;
  provider?: WebrtcProvider;
  user?: User;
  withHeading?: boolean;
}) => {
  const extensions: Extensions = [
    StarterKit.configure({
      history: false,
      document: params.withHeading ? false : undefined,
    }),
    Collaboration.configure({ document: params.doc }),
    CollaborationCursor.configure({
      provider: params.provider,
      user: {
        name: params.user?.displayName ?? "Unknown User",
        color: params.user
          ? hslToHex(getHueFromString(params.user.uid), 70, 80)
          : "#d0d0d0",
      },
    }),
  ];

  if (params.withHeading) {
    extensions.push(CustomDocument);
    extensions.push(
      Placeholder.configure({
        placeholder: ({ node, pos }) => {
          if (node.type.name === "heading") {
            return "Add a title";
          }

          return "";
        },
      })
    );
  }

  return extensions;
};
