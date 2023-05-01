import { Flex } from "@/components/layout/flex";
import { OnboardingLayout } from "@/components/layout/layouts";
import { H4, H5 } from "@/components/text/headings";
import { Title } from "@/components/head/title";
import { Card } from "@/components/layout/cards";
import Image from "next/image";
import { Div } from "@/components/layout/utils";
import { Progress } from "@/components/forms/progress";
import { Yup } from "@/lib/yup";
import "react-datepicker/dist/react-datepicker.css";
import { Field, FieldProps, Formik } from "formik";
import { axiosPrivate } from "@/lib/axios";
import { Form } from "@/components/forms/form";
import { Feedback } from "@/components/forms/feedback";
import { DateTime } from "luxon";
import { InputInner, InputOuter } from "@/components/forms/input";
import { Button, TertiaryButton } from "@/components/navigation/button";
import { useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";
import { refreshToken } from "@/lib/user/auth";
import store from "@/redux/store";

const OnboardingSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("Please provide your first name")
    .ensure()
    .min(2, "Please provide your first name")
    .max(35, "Your first name may not be longer than 35 characters"),
  lastName: Yup.string()
    .required("Please provide your surname")
    .ensure()
    .min(2, "Please provide your surname")
    .max(35, "Your surname may not be longer than 35 characters"),
  dateOfBirth: Yup.string()
    .required("Please provide your date of birth")
    .matches(
      /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/,
      "Please enter your date of birth in the format yyyy-mm-dd, for example 2001-12-31"
    )
    .test(
      "DOB",
      "You must be at least 13 years old to use Revolancer",
      (value) => {
        return (
          DateTime.fromISO(value ?? "") < DateTime.now().minus({ year: 13 })
        );
      }
    ),
  userName: Yup.string()
    .required("Please provide a username")
    .ensure()
    .min(3, "Your username must be at least 3 characters long")
    .max(20, "Your username may not be longer than 20 characters")
    .matches(
      /^[0-9a-z][0-9a-z\-]{1,18}[0-9a-z]$/,
      "Usernames may only contain the characters 0-9 and a-z, as well as the hyphen character (-). Additionally, they must start and end with either a number or a letter."
    ),
});

const validateUsernameAsync = async (username: string) => {
  if (username == "") return;
  const result = await axiosPrivate
    .post("user/username_available", {
      userName: username,
    })
    .then((res) => res.data)
    .catch((err) => {
      return false;
    });
  if (result !== true) return "This username is not available";
};

export default function GetStarted() {
  const formik = useRef<any>();
  const debouncedValidate = useMemo(
    () => debounce(() => formik.current?.validateForm, 500),
    [formik]
  );
  useEffect(() => {
    debouncedValidate();
  }, [formik.current?.values, debouncedValidate]);

  return (
    <>
      <Title>Get Started</Title>
      <OnboardingLayout>
        <Card
          css={{
            gridColumn: "1 / 5",
            "@sm": { gridColumn: "1 / 9" },
            "@md": { gridColumn: "2 / 12" },
            "@xl": { gridColumn: "3 / 11" },
            gap: "$7",
            padding: "$7",
          }}
        >
          <Flex gap={7}>
            <Div
              css={{
                height: "100%",
                minHeight: "600px",
                display: "none",
                width: "0",
                position: "relative",
                borderRadius: "$2",
                overflow: "hidden",
                "@md": { display: "block", width: "168px" },
                flexShrink: "0",
                flexGrow: "0",
              }}
            >
              <Image
                fill
                style={{ objectFit: "cover" }}
                alt=""
                src="/img/onboarding/onboarding1.jpg"
              />
            </Div>
            <Flex column css={{ flexGrow: "1", width: "100%" }}>
              <Progress progress={10} />
              <H4>Personal information</H4>
              <Formik
                innerRef={formik}
                initialValues={{
                  firstName: "",
                  lastName: "",
                  dateOfBirth: "",
                  userName: "",
                }}
                validationSchema={OnboardingSchema}
                validateOnChange={false}
                validateOnMount={true}
                onSubmit={async (values, actions) => {
                  actions.setSubmitting(true);
                  await axiosPrivate
                    .post("user/onboarding/1", values)
                    .then(async (response) => {
                      if (response.data?.success == "false") {
                        actions.setFieldError(
                          "userName",
                          "Oops, something went wrong"
                        );
                      } else {
                        await store?.dispatch(refreshToken());
                        window.location.href = "/get-started/2";
                      }
                    })
                    .catch((reason) => {
                      //TODO - error handling
                      if (reason.code == "ERR_NETWORK") {
                        actions.setFieldError("userName", "err_network");
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
                    <Form onSubmit={props.handleSubmit} css={{ gap: "$7" }}>
                      <Flex column>
                        <H5>Name</H5>
                        <Flex
                          css={{
                            flexWrap: "wrap",
                            "@md": { flexWrap: "nowrap" },
                          }}
                        >
                          <InputOuter
                            error={
                              props.touched.firstName &&
                              !!props.errors.firstName
                            }
                          >
                            <InputInner
                              type="text"
                              name="firstName"
                              id="firstName"
                              autoComplete="given-name"
                              placeholder="First Name"
                              aria-label="First Name"
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.firstName}
                            ></InputInner>
                          </InputOuter>
                          <InputOuter
                            error={
                              props.touched.lastName && !!props.errors.lastName
                            }
                          >
                            <InputInner
                              type="text"
                              name="lastName"
                              id="lastName"
                              autoComplete="family-name"
                              placeholder="Surname"
                              aria-label="Surname"
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.lastName}
                            ></InputInner>
                          </InputOuter>
                        </Flex>
                        {props.touched.firstName && props.errors.firstName && (
                          <Feedback state="error">
                            {props.errors.firstName}
                          </Feedback>
                        )}
                        {props.touched.lastName && props.errors.lastName && (
                          <Feedback state="error">
                            {props.errors.lastName}
                          </Feedback>
                        )}
                      </Flex>
                      <Flex column>
                        <H5>Date of Birth</H5>
                        <InputOuter
                          error={
                            props.touched.dateOfBirth &&
                            !!props.errors.dateOfBirth
                          }
                        >
                          <InputInner
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            autoComplete="bday"
                            placeholder="Date of Birth"
                            aria-label="Date of Birth"
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.dateOfBirth}
                          ></InputInner>
                        </InputOuter>
                        {props.touched.dateOfBirth &&
                          props.errors.dateOfBirth && (
                            <Feedback state="error">
                              {props.errors.dateOfBirth}
                            </Feedback>
                          )}
                      </Flex>
                      <Flex column>
                        <H5>Username</H5>
                        <InputOuter
                          error={
                            props.touched.userName && !!props.errors.userName
                          }
                        >
                          app.revolancer.com/u/
                          <Field
                            name="userName"
                            validate={validateUsernameAsync}
                          >
                            {({ form, field }: FieldProps) => (
                              <InputInner
                                type="text"
                                name="userName"
                                id="userName"
                                placeholder="username"
                                aria-label="Username"
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                value={field.value}
                              ></InputInner>
                            )}
                          </Field>
                        </InputOuter>
                        {props.errors.userName == "err_network" ? (
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
                          props.touched.userName &&
                          props.errors.userName && (
                            <Feedback state="error">
                              {props.errors.userName}
                            </Feedback>
                          )
                        )}
                      </Flex>
                      <Flex css={{ flexDirection: "row-reverse" }}>
                        <Button
                          onClick={() => {
                            props.submitForm();
                          }}
                          disabled={props.isSubmitting}
                        >
                          Next
                        </Button>
                      </Flex>
                    </Form>
                  );
                }}
              </Formik>
            </Flex>
          </Flex>
        </Card>
      </OnboardingLayout>
    </>
  );
}
