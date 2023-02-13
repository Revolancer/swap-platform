import { Feedback } from "@/components/forms/feedback";
import { Form } from "@/components/forms/form";
import { InputInner, InputOuter } from "@/components/forms/input";
import { Card } from "@/components/layout/cards";
import { LoginLayout } from "@/components/layout/layouts";
import { FormButton } from "@/components/navigation/button";
import { H4 } from "@/components/text/headings";
import { Yup } from "@/lib/yup/yup";
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
        <Card css={{ gridColumn: "4 / 10" }}>
          <H4 css={{ textAlign: "center" }}>Welcome to Revolancer! 🤩</H4>
          <Formik
            initialValues={{
              email: "",
              password: "",
              repeatpassword: "",
            }}
            validationSchema={RegistrationSchema}
            onSubmit={(values, actions) => {
              // same shape as initial values

              console.log(values);
              actions.setSubmitting(false);
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <InputOuter
                  error={
                    props.touched.email && props.errors.email != "undefined"
                  }
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
                {props.touched.email && props.errors.email && (
                  <Feedback state="error">{props.errors.email}</Feedback>
                )}
                <InputOuter
                  error={
                    props.touched.password &&
                    typeof props.errors.password != "undefined"
                  }
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
                    typeof props.errors.repeatpassword != "undefined"
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
                <FormButton type="submit">Register</FormButton>
              </Form>
            )}
          </Formik>
        </Card>
      </LoginLayout>
    </>
  );
}
