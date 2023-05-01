import { OutputData } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";
import { editorTools } from "./tools";
import { useEffect, useState } from "react";
import { Field, FieldProps } from "formik";

const NeedEditor = ({
  name,
  data = {
    time: 1682956618189,
    blocks: [],
    version: "2.26.5",
  },
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
        tools: editorTools("need") as any,
        placeholder: "Let us know what you need!",
        onChange: async (api) => {
          setOutput(await api.saver.save());
        },
      });
      setEditor(e);
      const doInitialSave = async (e: EditorJS) => {
        await e.isReady;
        setOutput(await e.save());
      };
      doInitialSave(e);
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

export default NeedEditor;
