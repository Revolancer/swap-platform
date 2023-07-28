import { Field, FieldProps } from 'formik';
import { Feedback } from './feedback';
import { InputOuter } from './input';
import { ChangeEvent, useState } from 'react';
import { Button } from '../navigation/button';
import { Flex } from '../layout/flex';
import { RoundedSquareImage } from '../user/roundedsquareimage';
import { uploadFile } from '@/lib/upload';

const UploadField = ({
  name,
  placeholder,
  type = 'any',
}: {
  name: string;
  placeholder?: string;
  type?: 'any' | 'image';
}) => {
  const [fileName, setFileName] = useState(placeholder ?? 'Upload File');
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
        const isImage = (file: File) => {
          const validTypes = ['image/gif', 'image/jpeg', 'image/png'];
          const validExtensions = ['gif', 'jpg', 'jpeg', 'png'];
          const extStart = file.name.lastIndexOf('.');
          const extension = file.name.substring(extStart + 1);
          return (
            validTypes.includes(file.type) &&
            validExtensions.includes(extension)
          );
        };

        const uploadFileField = async (file: File) => {
          setFieldError(name, undefined);
          setFileName(file.name);
          if (type == 'image' && !isImage(file)) {
            setFieldError(
              name,
              'Please provide a valid image. Supported types are jpg, gif, and png.',
            );
            setFieldTouched(name, true, false);
            setFieldValue(name, '', false);
            return;
          }
          if (file.size > 40000000) {
            //40MB max upload size
            setFieldError(name, 'Maximum file size is 40MB');
            setFieldTouched(name, true, false);
            setFieldValue(name, '', false);
            return;
          }
          try {
            setFieldValue(name, await uploadFile(file));
          } catch (err: any) {
            setFieldError(name, `Error uploading file`);
            setFieldTouched(name, true, false);
            setFieldValue(name, '', false);
            return;
          }
        };

        const getFile = async (event: ChangeEvent<HTMLInputElement>) => {
          setUploading(true);
          const file = event.target?.files?.item(0);
          if (file instanceof File) {
            await uploadFileField(file);
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
            <Flex>
              {type == 'image' && (
                <RoundedSquareImage
                  alt="The uploaded image"
                  size="large"
                  url={value}
                />
              )}
              <InputOuter error={touched[name] && !!errors[name]}>
                <input
                  type="file"
                  id={`upload-${name}`}
                  hidden
                  style={{ display: 'none' }}
                  onChange={getFile}
                />
                <Flex
                  css={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    cursor: uploading ? 'progress' : 'pointer',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    triggerFileField();
                  }}
                >
                  <span>{fileName}</span>
                  <Button
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      triggerFileField();
                    }}
                    size="small"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </Flex>
              </InputOuter>
            </Flex>
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
