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
import { InputInner, InputOuter, Slider } from "@/components/forms/input";
import { Select, SelectGroup, SelectItem } from "@/components/forms/select";
import { Button } from "@/components/navigation/button";
import { TwoCols } from "@/components/layout/columns";
import { TagField } from "@/components/forms/taginput";

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
                src="/img/onboarding/onboarding3.jpg"
              />
            </Div>
            <Flex column css={{ flexGrow: "1" }}>
              <Progress progress={75} />
              <H4>Your Profile</H4>
              <Formik
                initialValues={{
                  experience: 0,
                  currency: undefined,
                  hourlyRate: "",
                }}
                validationSchema={OnboardingSchema}
                onSubmit={async (values, actions) => {
                  actions.setSubmitting(true);
                  await axiosPrivate
                    .post("user/onboarding/3", values)
                    .then((response) => {
                      window.location.href = "/";
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
                        <H5>Profile Picture</H5>
                      </Flex>
                      <Flex column>
                        <H5>Skills &amp; Tools</H5>
                        <span>
                          Use tags to show the skills and tools you are familiar
                          with.
                        </span>
                        <TagField name="skills" />
                      </Flex>
                      <TwoCols>
                        <Flex column>
                          <H5>Location</H5>
                        </Flex>
                        <Flex column>
                          <H5>Timezone</H5>
                        </Flex>
                      </TwoCols>
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
