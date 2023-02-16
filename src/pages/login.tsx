import { Feedback } from "@/components/forms/feedback";
import { Form } from "@/components/forms/form";
import {
  InputInner,
  InputOuter,
  PasswordReveal,
} from "@/components/forms/input";
import { Card } from "@/components/layout/cards";
import { Flex } from "@/components/layout/flex";
import { LoginLayout } from "@/components/layout/layouts";
import {
  FormButton,
  Link,
  TertiaryButton,
} from "@/components/navigation/button";
import { AuthGuard } from "@/components/navigation/guards/authguard";
import { H4 } from "@/components/text/headings";
import { P } from "@/components/text/text";
import { login } from "@/lib/user/auth";
import { Yup } from "@/lib/yup/yup";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RegistrationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Please provide a valid email address"),
  password: Yup.string().password().required("Please provide your password"),
});

export default function Register() {
  const [pwType, setPwType] = useState("password");

  const dispatch = useDispatch();

  return (
    <>
      <LoginLayout>
        <AuthGuard redirectIfAuthed>
          <Card
            css={{
              gridColumn: "1 / 5",
              "@sm": { gridColumn: "2 / 8" },
              "@md": { gridColumn: "3 / 11" },
              "@xl": { gridColumn: "4 / 10" },
              gap: "$7",
              padding: "$7",
            }}
          >
            <H4 css={{ textAlign: "center" }}>Welcome back 👋</H4>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={RegistrationSchema}
              onSubmit={async (values, actions) => {
                actions.setSubmitting(true);
                await axios
                  .post(`${process.env.NEXT_PUBLIC_API_HOST}auth/login`, values)
                  .then((response) => {
                    console.log(response);
                    dispatch(login(response.data));
                  })
                  .catch((reason) => {
                    if (reason.code == "ERR_NETWORK") {
                      actions.setFieldError("password", "err_network");
                    } else {
                      const statuscode = Number(reason?.response?.status);
                      switch (statuscode) {
                        case 401:
                          actions.setFieldError(
                            "password",
                            "Looks like your email address or password is incorrect."
                          );
                          break;
                        default:
                          console.log(reason.response);
                          break;
                      }
                    }
                  });
                actions.setSubmitting(false);
              }}
            >
              {(props) => {
                return (
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
                      <InputOuter
                        error={
                          props.touched.password && !!props.errors.password
                        }
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
                            pwType == "text"
                              ? setPwType("password")
                              : setPwType("text");
                          }}
                        />
                      </InputOuter>
                      {props.errors.password == "err_network" ? (
                        <Feedback state="error">
                          Looks like the site is experiencing heavy traffic
                          right now. Please try again, or if the issue
                          continues, check our
                          <TertiaryButton
                            href="https://status.revolancer.com/"
                            rel="nofollow"
                            target="_blank"
                          >
                            status page
                          </TertiaryButton>{" "}
                          for updates.
                        </Feedback>
                      ) : (
                        props.touched.password &&
                        props.errors.password && (
                          <Feedback state="error">
                            {props.errors.password}
                          </Feedback>
                        )
                      )}
                    </Flex>
                    <FormButton type="submit" disabled={props.isSubmitting}>
                      Login
                    </FormButton>
                    <P css={{ textAlign: "center" }}>
                      Don&rsquo;t have an account?{" "}
                      <Link href="/register">Register Now!</Link>
                    </P>
                  </Form>
                );
              }}
            </Formik>
          </Card>
        </AuthGuard>
      </LoginLayout>
    </>
  );
}
