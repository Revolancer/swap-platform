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
import { Formik } from "formik";
import { axiosPrivate } from "@/lib/axios";
import { Form } from "@/components/forms/form";
import { Feedback } from "@/components/forms/feedback";
import { Slider } from "@/components/forms/input";

const OnboardingSchema = Yup.object().shape({
  experience: Yup.number().min(0).max(10),
  currency: Yup.string()
    .required("Please provide your currency")
    .oneOf(
      ["gbp", "eur", "usd"],
      "Sorry, we do not currently support that currency. Please provide the equivalent rate in GBP, USD, or EUR"
    )
    .ensure(),
  hourlyRate: Yup.number()
    .required("Please provide your hourly rate")
    .min(5, "We recommend charging more")
    .max(
      10000,
      "Your hourly rate is extremely high, we recommend a lower rate"
    ),
});

export default function GetStarted() {
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
                src="/img/onboarding/onboarding2.jpg"
              />
            </Div>
            <Flex column css={{ flexGrow: "1" }}>
              <Progress progress={33} />
              <H4>Professional information</H4>
              <Formik
                initialValues={{
                  experience: 0,
                  currency: "",
                  hourlyRate: "",
                }}
                validationSchema={OnboardingSchema}
                onSubmit={async (values, actions) => {
                  actions.setSubmitting(true);
                  await axiosPrivate
                    .post("user/onboarding/2", values)
                    .then((response) => {
                      window.location.href = "/get-started/3";
                    })
                    .catch((reason) => {
                      //TODO - error handling
                      if (reason.code == "ERR_NETWORK") {
                        actions.setFieldError(
                          "marketingthirdparty",
                          "err_network"
                        );
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
                        <H5>Experience</H5>
                        <span>
                          How many years of experience do you have in your field
                          of work?
                        </span>
                        <Slider max={10} />
                        <Flex
                          css={{
                            justifyContent: "space-between",
                            paddingInlineStart: "12px",
                            paddingInlineEnd: "4px",
                          }}
                        >
                          <span>0</span>
                          <span>10+</span>
                        </Flex>
                        {props.touched.experience &&
                          props.errors.experience && (
                            <Feedback state="error">
                              {props.errors.experience}
                            </Feedback>
                          )}
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
