import { axiosPrivate } from "@/lib/axios";
import { Yup } from "@/lib/yup";
import { Formik } from "formik";
import { Form } from "../../forms/form";
import { InputOuter, TextAreaInner } from "../../forms/input";
import { Feedback } from "../../forms/feedback";
import { Flex } from "../../layout/flex";
import { Button, TertiaryButton } from "../../navigation/button";
import { StoredUploadField } from "@/components/forms/stored-upload";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

const MessageSchema = Yup.object().shape({
  message: Yup.string().required("You cannot send an empty message").ensure(),
  attachment: Yup.string().optional().ensure(),
});

export const ProjectMessageInput = ({
  projectId,
  refresh,
}: {
  projectId: string;
  refresh?: () => void;
}) => {
  const [showAttachmentField, setShowAttachmentField] = useState(false);
  return (
    <Formik
      initialValues={{
        message: "",
        attachment: "",
      }}
      validationSchema={MessageSchema}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await axiosPrivate
          .put(`projects/${projectId}/messages`, values)
          .then(async (response) => {
            if (response.data?.success == "false") {
              actions.setFieldError("about", "Oops, something went wrong");
            } else {
              actions.resetForm();
              await axiosPrivate.storage.remove(`project-threads-${projectId}`);
              if (refresh) refresh();
            }
          })
          .catch((reason) => {
            //TODO - error handling
            if (reason.code == "ERR_NETWORK") {
              actions.setFieldError("message", "Oops, something went wrong");
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
          <Form onSubmit={props.handleSubmit} css={{ gap: "$3" }}>
            <InputOuter error={props.touched.message && !!props.errors.message}>
              <TextAreaInner
                name="message"
                id="message-body"
                placeholder="Write a message"
                aria-label="message"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.message}
              />
            </InputOuter>
            {props.touched.message && props.errors.message && (
              <Feedback state="error">{props.errors.message}</Feedback>
            )}
            {showAttachmentField && <StoredUploadField name="attachment" />}
            <Flex css={{ alignItems: "center" }}>
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
                    props.setFieldValue("attachment", "");
                  }
                  setShowAttachmentField(!showAttachmentField);
                }}
                disabled={props.isSubmitting}
              >
                <FontAwesomeIcon icon={faPaperclip} />{" "}
                {!showAttachmentField ? "Add" : "Remove"} Attachment
              </TertiaryButton>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};
