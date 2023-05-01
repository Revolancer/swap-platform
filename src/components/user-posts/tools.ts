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
import { uploadForEditorJs } from "@/lib/upload";

export const editorTools = () => {
  return {
    header: Header,
    paragraph: Paragraph,
    embed: Embed,
    table: Table,
    code: Code,
    image: {
      class: Image,
      config: { uploader: { uploadByFile: uploadForEditorJs } },
    },
    quote: Quote,
    marker: Marker,
    underline: Underline,
    list: List,
  };
};
