import { OutputData } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";
import { editorTools } from "./tools";
import { useEffect, useState } from "react";
import DragDrop from "editorjs-drag-drop";
import { Field, FieldProps } from "formik";

const PortfolioEditor = ({
  name,
  data,
}: {
  name: string;
  data?: OutputData;
}) => {
  const [editor, setEditor] = useState<EditorJS | undefined>(undefined);
  const [output, setOutput] = useState(data);
  useEffect(() => {
    if (!editor) {
      let e = new EditorJS({
        data: data,
        holder: "editorjs",
        tools: editorTools(),
        placeholder: "Let us know about a project you've worked on!",
        onReady: () => {
          new DragDrop(e);
        },
        onChange: async (api) => {
          setOutput(await api.saver.save());
        },
      });
      setEditor(e);
    }
  }, [editor, data]);
  return (
    <Field name={name} id={`editor-${name}`}>
      {({ form: { setFieldValue, values } }: FieldProps) => {
        if ((values[name]?.time ?? 0) != (output?.time ?? 0)) {
          setFieldValue(name, output);
        }
        return <div id="editorjs"></div>;
      }}
    </Field>
  );
};

export default PortfolioEditor;
