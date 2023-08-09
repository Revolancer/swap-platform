import { axiosPrivate } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Formik } from 'formik';
import { Form } from '../forms/form';
import { InputOuter, TextAreaInner } from '../forms/input';
import { Feedback } from '../forms/feedback';
import { Flex } from '../layout/flex';
import { Buttons } from '@revolancer/ui';
const { Button, TertiaryButton } = Buttons;
import { useState } from 'react';
import { StoredUploadField } from '../forms/stored-upload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

const MessageSchema = Yup.object().shape({
  body: Yup.string().optional().ensure(),
  attachment: Yup.string().optional().ensure(),
});

export const MessageInput = ({
  uid,
  refresh,
}: {
  uid: string;
  refresh?: () => void;
}) => {
  const [showAttachmentField, setShowAttachmentField] = useState(false);
  return (
    <Formik
      initialValues={{
        body: '',
        attachment: '',
      }}
      validationSchema={MessageSchema}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await axiosPrivate
          .put(`message/${uid}`, values)
          .then(async (response) => {
            if (response.data?.success == 'false') {
              actions.setFieldError('about', 'Oops, something went wrong');
            } else {
              actions.resetForm();
              await axiosPrivate.storage.remove(`message-threads-${uid}`);
              if (refresh) refresh();
            }
          })
          .catch((reason) => {
            //TODO - error handling
            if (reason.code == 'ERR_NETWORK') {
              actions.setFieldError('about', 'Oops, something went wrong');
            } else {
              const statuscode = Number(reason?.response?.status);
              switch (statuscode) {
                default:
                  //TODO: Other failure reasons (not validated, etc)
                  console.log(reason);
                  break;
              }
            }
          });
        actions.setSubmitting(false);
      }}
    >
      {(props) => {
        return (
          <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
            <InputOuter error={props.touched.body && !!props.errors.body}>
              <TextAreaInner
                name="body"
                id="message-body"
                placeholder="Write a message"
                aria-label="about"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.body}
              />
            </InputOuter>
            {props.touched.body && props.errors.body && (
              <Feedback state="error">{props.errors.body}</Feedback>
            )}
            {showAttachmentField && <StoredUploadField name="attachment" />}
            <Flex css={{ alignItems: 'center' }}>
              <Button
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  props.submitForm();
                }}
                disabled={props.isSubmitting}
              >
                Send
              </Button>
              <TertiaryButton
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (showAttachmentField) {
                    props.setFieldValue('attachment', '');
                  }
                  setShowAttachmentField(!showAttachmentField);
                }}
                disabled={props.isSubmitting}
              >
                <FontAwesomeIcon icon={faPaperclip} />{' '}
                {!showAttachmentField ? 'Add' : 'Remove'} Attachment
              </TertiaryButton>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};
