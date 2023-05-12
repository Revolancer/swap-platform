import { Feedback } from "@/components/forms/feedback";
import { Form } from "@/components/forms/form";
import {
  InputInner,
  InputOuter,
  PasswordReveal,
} from "@/components/forms/input";
import { Title } from "@/components/head/title";
import { Card } from "@/components/layout/cards";
import { Flex } from "@/components/layout/flex";
import { LoginLayout } from "@/components/layout/layouts";
import {
  FormButton,
  Link,
  TertiaryButton,
} from "@/components/navigation/button";
import { H4 } from "@/components/text/headings";
import { P } from "@/components/text/text";
import { login, updatePassword, updateEmail } from "@/lib/user/auth";
import { Yup } from "@/lib/yup";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Formik } from "formik";
import { useCallback, useState } from "react";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Please provide a valid email address"),
  password: Yup.string().required("Please provide your password"),
});

export default function Login() {
  const [pwType, setPwType] = useState("password");

  const email = useAppSelector((state) => state.userData.email);
  const password = useAppSelector((state) => state.userData.password);

  const dispatch = useAppDispatch();

  const handleEmailChange = useCallback(
    (value: string) => dispatch(updateEmail(value)),
    [dispatch]
  );

  const handlePasswordChange = useCallback(
    (value: string) => dispatch(updatePassword(value)),
    [dispatch]
  );

  const handleLogin = useCallback(
    async () => await dispatch(login()),
    [dispatch]
  );

  return (
    <>
      <Title>Log in</Title>
      <LoginLayout>
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
            validationSchema={LoginSchema}
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={async (_, actions) => {
              actions.setSubmitting(true);
              const result = await dispatch(login());
              if (result.meta.requestStatus == "rejected") {
                actions.setFieldError(
                  "password",
                  "The provided email address or password is incorrect."
                );
              }
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
                        onChange={(e) => {
                          props.handleChange(e);
                          handleEmailChange(e.target.value);
                        }}
                        value={email}
                      ></InputInner>
                    </InputOuter>
                    {props.touched.email && props.errors.email && (
                      <Feedback state="error">{props.errors.email}</Feedback>
                    )}
                    <InputOuter
                      error={props.touched.password && !!props.errors.password}
                    >
                      <InputInner
                        type={pwType}
                        name="password"
                        id="password"
                        placeholder="Password"
                        aria-label="Password"
                        onChange={(e) => {
                          props.handleChange(e);
                          handlePasswordChange(e.target.value);
                        }}
                        value={password}
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
                        Looks like the site is experiencing heavy traffic right
                        now. Please try again, or if the issue continues, check
                        our
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
                  <P css={{ textAlign: "center", color: "$neutral600" }}>
                    <strong>Please Note</strong> If you are already a member of
                    Revolancer Classic,
                    <br />
                    you&rsquo;ll need to{" "}
                    <Link href="/register">create an account</Link> to use the
                    beta experience.
                  </P>
                </Form>
              );
            }}
          </Formik>
        </Card>
      </LoginLayout>
    </>
  );
}
