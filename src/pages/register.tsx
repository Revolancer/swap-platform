import { Feedback } from "@/components/forms/feedback";
import { Form } from "@/components/forms/form";
import { InputInner, InputOuter } from "@/components/forms/input";
import { Card } from "@/components/layout/cards";
import { Flex } from "@/components/layout/flex";
import { LoginLayout } from "@/components/layout/layouts";
import {
  FormButton,
  Link,
  TertiaryButton,
} from "@/components/navigation/button";
import { H4 } from "@/components/text/headings";
import { Yup } from "@/lib/yup/yup";
import axios from "axios";
import { Formik } from "formik";

const RegistrationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Please provide a valid email address"),
  password: Yup.string().password().required("Please provide a password"),
  repeatpassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function Register() {
  return (
    <>
      <LoginLayout>
        <Card css={{ gridColumn: "4 / 10", gap: "$7" }}>
          <H4 css={{ textAlign: "center" }}>Welcome to Revolancer! 🤩</H4>
          <Formik
            initialValues={{
              email: "",
              password: "",
              repeatpassword: "",
            }}
            validationSchema={RegistrationSchema}
            onSubmit={(values, actions) => {
              const { repeatpassword: _, ...data } = values;
              axios
                .post(`${process.env.NEXT_PUBLIC_API_HOST}auth/register`, data)
                .then((response) => {
                  //TODO: Success, store tokens
                  console.log(response);
                })
                .catch((reason) => {
                  const statuscode = Number(reason?.response?.status);
                  switch (statuscode) {
                    case 409:
                      actions.setFieldError("email", "exists");
                      break;
                    default:
                      //TODO: Other failure reasons (not validated, etc)
                      console.log(reason.response);
                      break;
                  }
                });
              actions.setSubmitting(false);
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit} css={{ gap: "$7" }}>
                <Flex column gap="3">
                  <InputOuter
                    error={props.touched.email && !!props.errors.email}
                  >
                    <InputInner
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      aria-label="Email"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                    ></InputInner>
                  </InputOuter>
                  {props.errors.email == "exists" ? (
                    <Feedback state="error">
                      Looks like you already have an account!{" "}
                      <TertiaryButton href="/login">
                        Click here to log in
                      </TertiaryButton>{" "}
                      or{" "}
                      <TertiaryButton href="/login">
                        Click here to reset your password
                      </TertiaryButton>
                    </Feedback>
                  ) : (
                    props.touched.email &&
                    props.errors.email && (
                      <Feedback state="error">{props.errors.email}</Feedback>
                    )
                  )}
                  <InputOuter
                    error={props.touched.password && !!props.errors.password}
                  >
                    <InputInner
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      aria-label="Password"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.password}
                    ></InputInner>
                  </InputOuter>
                  {props.touched.password && props.errors.password && (
                    <Feedback state="error">{props.errors.password}</Feedback>
                  )}
                  <InputOuter
                    error={
                      props.touched.repeatpassword &&
                      !!props.errors.repeatpassword
                    }
                  >
                    <InputInner
                      type="password"
                      name="repeatpassword"
                      id="repeatpassword"
                      placeholder="Repeat Password"
                      aria-label="Repeat Password"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.repeatpassword}
                    ></InputInner>
                  </InputOuter>
                  {props.touched.repeatpassword &&
                    props.errors.repeatpassword && (
                      <Feedback state="error">
                        {props.errors.repeatpassword}
                      </Feedback>
                    )}
                </Flex>
                <FormButton type="submit" role="secondary">
                  Register
                </FormButton>
              </Form>
            )}
          </Formik>
        </Card>
      </LoginLayout>
    </>
  );
}
