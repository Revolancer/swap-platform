import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Code from "@editorjs/code";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Underline from "@editorjs/underline";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Hyperlink from "editorjs-hyperlink";
import { uploadForEditorJs } from "@/lib/upload";

type EditorReason = "portfolio" | "need";

export const editorTools = (reason: EditorReason = "portfolio") => {
  if (reason == "need") {
    return {
      header: Header,
      paragraph: { class: Paragraph, inlineToolbar: true },
      embed: Embed,
      image: {
        class: Image,
        config: { uploader: { uploadByFile: uploadForEditorJs } },
        inlineToolbar: true,
      },
      marker: Marker,
      underline: Underline,
      list: { class: List, inlineToolbar: true },
      link: {
        class: Hyperlink,
        config: {
          shortcut: "CMD+L",
          target: "_blank",
          rel: "nofollow noreferrer noopener",
          availableTargets: ["_blank"],
          availableRels: ["nofollow noreferrer noopener"],
          validate: false,
        },
      },
    };
  }
  return {
    header: Header,
    paragraph: { class: Paragraph, inlineToolbar: true },
    embed: Embed,
    table: { class: Table, inlineToolbar: true },
    code: Code,
    image: {
      class: Image,
      config: { uploader: { uploadByFile: uploadForEditorJs } },
      inlineToolbar: true,
    },
    quote: Quote,
    marker: Marker,
    underline: Underline,
    list: { class: List, inlineToolbar: true },
    link: {
      class: Hyperlink,
      config: {
        shortcut: "CMD+L",
        target: "_blank",
        rel: "nofollow noreferrer noopener",
        availableTargets: ["_blank"],
        availableRels: ["nofollow noreferrer noopener"],
        validate: false,
      },
    },
  };
};
