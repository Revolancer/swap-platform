import { axiosPrivate } from "@/lib/axios";
import { Yup } from "@/lib/yup";
import { Formik } from "formik";
import { Form } from "../forms/form";
import { InputOuter, TextAreaInner } from "../forms/input";
import { Feedback } from "../forms/feedback";
import { Flex } from "../layout/flex";
import { Button } from "../navigation/button";

const MessageSchema = Yup.object().shape({
  body: Yup.string().optional().ensure(),
});

export const MessageInput = ({
  uid,
  refresh,
}: {
  uid: string;
  refresh?: () => void;
}) => {
  return (
    <Formik
      initialValues={{
        body: "",
      }}
      validationSchema={MessageSchema}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await axiosPrivate
          .put(`message/${uid}`, values)
          .then(async (response) => {
            if (response.data?.success == "false") {
              actions.setFieldError("about", "Oops, something went wrong");
            } else {
              actions.resetForm();
              await axiosPrivate.storage.remove(`message-threads-${uid}`);
              if (refresh) refresh();
            }
          })
          .catch((reason) => {
            //TODO - error handling
            if (reason.code == "ERR_NETWORK") {
              actions.setFieldError("about", "Oops, something went wrong");
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
            <Flex>
              <Button href="" onClick={props.submitForm}>
                Send
              </Button>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};
