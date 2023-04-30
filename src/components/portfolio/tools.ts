import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Underline from "@editorjs/underline";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import NestedList from "@editorjs/nested-list";
import CheckList from "@editorjs/checklist";
import Paragraph from "@editorjs/paragraph";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
import { uploadForEditorJs } from "@/lib/upload";

export const editorTools = () => {
  return {
    header: { class: Header, tunes: ["alignmentTune"] },
    paragraph: { class: Paragraph, tunes: ["alignmentTune"] },
    embed: Embed,
    table: Table,
    warning: Warning,
    code: Code,
    image: {
      class: Image,
      config: { uploader: { uploadByFile: uploadForEditorJs } },
    },
    quote: Quote,
    marker: Marker,
    checklist: CheckList,
    underline: Underline,
    nestedlist: NestedList,
    alignmentTune: {
      class: AlignmentTuneTool,
      config: {
        default: "left",
      },
    },
  };
};
