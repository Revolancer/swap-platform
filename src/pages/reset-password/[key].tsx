import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { axiosPublic } from "@/lib/axios";
import { P } from "@/components/text/text";
import { Title } from "@/components/head/title";
import { LoginLayout } from "@/components/layout/layouts";
import { Card } from "@/components/layout/cards";
import { H4 } from "@/components/text/headings";
import { Formik } from "formik";
import { Yup } from "@/lib/yup";
import { Flex } from "@/components/layout/flex";
import {
  InputInner,
  InputOuter,
  PasswordReveal,
} from "@/components/forms/input";
import { Feedback } from "@/components/forms/feedback";
import { Button, FormButton, Link } from "@/components/navigation/button";
import { SuccessModal } from "@/components/modals/success-modal";
import { Form } from "@/components/forms/form";
import { Turnstile } from "@/components/forms/turnstile";
import Image from "next/image";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .password()
    .required("Please provide a password")
    .label("Your new password"),
  repeatpassword: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function ResetPassword() {
  const [success, setSuccess] = useState(false);
  const [pwType, setPwType] = useState("password");
  const router = useRouter();
  const { key } = router.query;
  const [isNotFound, setNotFound] = useState(false);
  const [turnstileResponse, setTurnstileResponse] = useState("");

  useEffect(() => {
    if (!key) return;
    axiosPublic
      .get(`auth/reset_password/validate/${key}`)
      .catch(() => setNotFound(true));
  }, [key]);

  if (isNotFound) {
    return (
      <>
        <Title>Reset Password</Title>
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
            <H4 css={{ textAlign: "center" }}>Resetting your password</H4>
            <Flex column gap={4} css={{ alignItems: "center" }}>
              <Image
                src="/img/revy/happy.png"
                alt="Revy, happy to guide you back to safety"
                width={210}
                height={314}
              />
              <P>Sorry, it looks like your password reset link has expired.</P>
              <Button href="/forgot-password">Request a new link</Button>
            </Flex>
          </Card>
        </LoginLayout>
      </>
    );
  }

  return (
    <>
      <Title>Reset Password</Title>
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
          <H4 css={{ textAlign: "center" }}>Resetting your password</H4>
          <P>Please select a new password for your account.</P>
          <Formik
            initialValues={{
              password: "",
              repeatpassword: "",
              resetKey: key,
            }}
            validationSchema={ResetPasswordSchema}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              (values as any).turnstileResponse = turnstileResponse;
              await axiosPublic
                .post("auth/reset_password", values)
                .then((response) => {
                  setSuccess(true);
                })
                .catch((reason) => {
                  if (reason.code == "ERR_NETWORK") {
                    actions.setFieldError("password", "Something went wrong");
                  } else {
                    const statuscode = Number(reason?.response?.status);
                    switch (statuscode) {
                      default:
                        actions.setFieldError(
                          "password",
                          "Something went wrong",
                        );
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
                          pwType == "text"
                            ? setPwType("password")
                            : setPwType("text");
                        }}
                      />
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
                        type={pwType}
                        name="repeatpassword"
                        id="repeatpassword"
                        placeholder="Confirm Password"
                        aria-label="Confirm Password"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.repeatpassword}
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
                    {props.touched.repeatpassword &&
                      props.errors.repeatpassword && (
                        <Feedback state="error">
                          {props.errors.repeatpassword}
                        </Feedback>
                      )}
                  </Flex>
                  <Flex css={{ justifyContent: "center" }}>
                    <Turnstile
                      onSuccess={(token) => setTurnstileResponse(token)}
                      onError={() => {
                        setTurnstileResponse("");
                      }}
                    />
                  </Flex>
                  <input
                    type="hidden"
                    name="resetKey"
                    value={props.values.resetKey}
                  />
                  <FormButton type="submit" disabled={props.isSubmitting}>
                    Reset
                  </FormButton>
                  <P css={{ textAlign: "center", color: "$neutral600" }}>
                    Don&rsquo;t need to reset your password?{" "}
                    <Link href="/login">Log in.</Link>
                  </P>
                  {success && (
                    <SuccessModal
                      successMessage="Your password has been reset"
                      onClose={() => {
                        setSuccess(false);
                        router.replace("/login");
                      }}
                    />
                  )}
                </Form>
              );
            }}
          </Formik>
        </Card>
      </LoginLayout>
    </>
  );
}
