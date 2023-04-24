import { Field, FieldProps } from "formik";
import { Feedback } from "./feedback";
import { InputOuter } from "./input";
import { ChangeEvent, useEffect, useState } from "react";
import { axiosPrivate } from "@/lib/axios";
import axios from "axios";
import { Button } from "../navigation/button";
import { Div } from "../layout/utils";
import { Flex } from "../layout/flex";

const UploadField = ({
  name,
  placeholder,
}: {
  name: string;
  placeholder?: string;
}) => {
  const [fileName, setFileName] = useState(placeholder ?? "Upload File");
  const [uploading, setUploading] = useState(false);

  return (
    <Field name={name} id={`upload-${name}`}>
      {({
        field: { value },
        form: {
          setFieldValue,
          errors,
          touched,
          setFieldError,
          setFieldTouched,
        },
      }: FieldProps) => {
        const uploadFile = async (file: File) => {
          setFieldError(name, undefined);
          setFileName(file.name);
          const options = { headers: { "Content-Type": file.type } };
          if (file.size > 40000000) {
            //40MB max upload size
            setFieldError(name, "Maximum file size is 40MB");
            setFieldTouched(name, true, false);
            setFieldValue(name, "", false);
            return;
          }
          try {
            const urls = await axiosPrivate
              .get(`upload/url?filename=${file.name}&size=${file.size}`)
              .then((response) => response.data);

            if (!urls.signedUrl) {
              setFieldError(name, "Error uploading file");
              setFieldTouched(name, true, false);
              setFieldValue(name, "", false);
              return;
            } else {
              await axios.put(urls.signedUrl, file, options);
              setFieldValue(name, urls.publicUrl);
            }
          } catch (err: any) {
            setFieldError(name, `Error uploading file: ${err.message}`);
            setFieldTouched(name, true, false);
            setFieldValue(name, "", false);
            return;
          }
        };

        const getFile = async (event: ChangeEvent<HTMLInputElement>) => {
          setUploading(true);
          const file = event.target?.files?.item(0);
          if (file instanceof File) {
            await uploadFile(file);
          }
          setUploading(false);
        };

        const triggerFileField = () => {
          if (!uploading) {
            document?.getElementById(`upload-${name}`)?.click();
          }
        };

        return (
          <>
            <InputOuter error={touched[name] && !!errors[name]}>
              <input
                type="file"
                id={`upload-${name}`}
                hidden
                style={{ display: "none" }}
                onChange={getFile}
              />
              <Flex
                css={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  cursor: uploading ? "progress" : "pointer",
                }}
                onClick={triggerFileField}
              >
                <span>{fileName}</span>
                <Button
                  onClick={triggerFileField}
                  size="small"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </Flex>
            </InputOuter>
            {touched[name] && errors[name] && (
              <Feedback state="error">{errors[name]}</Feedback>
            )}
          </>
        );
      }}
    </Field>
  );
};

export { UploadField };
