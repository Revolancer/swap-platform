import { Flex } from "../layout/flex";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { Form } from "../forms/form";
import { Formik } from "formik";
import { Yup } from "@/lib/yup";
import { Button } from "../navigation/button";
import {
  InputInner,
  InputOuter,
  PasswordReveal,
  TextAreaInner,
} from "../forms/input";
import { Feedback } from "../forms/feedback";
import { H5 } from "../text/headings";
import { P, Span } from "../text/text";
import { useState } from "react";
import { SuccessModal } from "../navigation/success-modal";

const UpdatePasswordSchema = Yup.object().shape({
  password: Yup.string().required("Please provide your current password"),
  newPassword1: Yup.string()
    .password()
    .required("Please provide your desired new password")
    .label("Your new password"),
  newPassword2: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword1")], "Passwords must match")
    .label("Your new password confirmation"),
});

export const ChangePassword = () => {
  const [pwType, setPwType] = useState("password");
  const [success, setSuccess] = useState(false);
  return (
    <Formik
      initialValues={{
        password: "",
        newPassword1: "",
        newPassword2: "",
      }}
      validationSchema={UpdatePasswordSchema}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await axiosPrivate
          .post("user/password", values)
          .then(() => {
            actions.resetForm();
            setSuccess(true);
          })
          .catch((reason) => {
            if (reason.code == "ERR_NETWORK") {
              actions.setFieldError("password", "Oops, something went wrong");
            } else {
              const statuscode = Number(reason?.response?.status);
              switch (statuscode) {
                case 401:
                  actions.setFieldError(
                    "password",
                    "Your existing password is incorrect"
                  );
                  break;
                case 406:
                  actions.setFieldError(
                    "newPassword2",
                    "Your new passwords must match"
                  );
                  break;
                default:
                  actions.setFieldError("password", "Something went wrong");
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
            <H5>Change Password</H5>
            <Span css={{ color: "$neutral700" }}>
              Provide your current password, type in the new one and click the
              Save button to change your password.
            </Span>
            <InputOuter
              error={props.touched.password && !!props.errors.password}
            >
              <InputInner
                type={pwType}
                name="password"
                id="password"
                placeholder="Password"
                aria-label="Password"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.password}
              ></InputInner>
              <PasswordReveal
                revealed={pwType == "text"}
                onClick={() => {
                  pwType == "text" ? setPwType("password") : setPwType("text");
                }}
              />
            </InputOuter>
            {props.touched.password && props.errors.password && (
              <Feedback state="error">{props.errors.password}</Feedback>
            )}
            <InputOuter
              error={props.touched.newPassword1 && !!props.errors.newPassword1}
            >
              <InputInner
                type={pwType}
                name="newPassword1"
                id="newPassword1"
                placeholder="New Password"
                aria-label="New Password"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.newPassword1}
              ></InputInner>
              <PasswordReveal
                revealed={pwType == "text"}
                onClick={() => {
                  pwType == "text" ? setPwType("password") : setPwType("text");
                }}
              />
            </InputOuter>
            {props.touched.newPassword1 && props.errors.newPassword1 && (
              <Feedback state="error">{props.errors.newPassword1}</Feedback>
            )}
            <InputOuter
              error={props.touched.newPassword2 && !!props.errors.newPassword2}
            >
              <InputInner
                type={pwType}
                name="newPassword2"
                id="newPassword2"
                placeholder="Confirm Password"
                aria-label="Confirm Password"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.newPassword2}
              ></InputInner>
              <PasswordReveal
                revealed={pwType == "text"}
                onClick={() => {
                  pwType == "text" ? setPwType("password") : setPwType("text");
                }}
              />
            </InputOuter>
            {props.touched.newPassword2 && props.errors.newPassword2 && (
              <Feedback state="error">{props.errors.newPassword2}</Feedback>
            )}
            <Button
              href="#"
              onClick={(e) => {
                e.preventDefault();
                props.submitForm();
              }}
            >
              Save
            </Button>
            {success && (
              <SuccessModal
                successMessage="Your password has been changed"
                onClose={() => {
                  setSuccess(false);
                }}
              />
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
