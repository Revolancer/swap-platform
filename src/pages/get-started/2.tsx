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
import { Button, TertiaryButton } from "@/components/navigation/button";
import { refreshToken } from "@/lib/user/auth";
import store from "@/redux/store";

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
              <Progress progress={40} />
              <H4>Professional information</H4>
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
                    .post("user/onboarding/2", values)
                    .then(async (response) => {
                      if (response.data?.success == "false") {
                        actions.setFieldError(
                          "hourlyrate",
                          "Oops, something went wrong"
                        );
                      } else {
                        await store?.dispatch(refreshToken());
                        window.location.href = "/get-started/3";
                      }
                    })
                    .catch((reason) => {
                      //TODO - error handling
                      if (reason.code == "ERR_NETWORK") {
                        actions.setFieldError("hourlyrate", "err_network");
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
                        <Slider name="experience" max={10} />
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
                      <Flex column>
                        <H5>Hourly Rate</H5>
                        <span>
                          How much do you typically charge per hour for your
                          services?
                        </span>
                        <Div
                          css={{
                            display: "grid",
                            gridTemplateColumns: "1fr 3fr",
                            gap: "$4",
                          }}
                        >
                          <Select name="currency" placeholder="Currency">
                            <SelectGroup>
                              <SelectItem value="gbp">GBP £</SelectItem>
                              <SelectItem value="usd">USD $</SelectItem>
                              <SelectItem value="eur">EUR €</SelectItem>
                            </SelectGroup>
                          </Select>
                          <InputOuter
                            error={
                              props.touched.hourlyRate &&
                              !!props.errors.hourlyRate
                            }
                          >
                            <InputInner
                              type="text"
                              name="hourlyRate"
                              id="hourlyRate"
                              placeholder="50"
                              aria-label="Hourly Rate"
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.hourlyRate}
                            ></InputInner>
                          </InputOuter>
                        </Div>
                        {props.touched.currency && props.errors.currency && (
                          <Feedback state="error">
                            {props.errors.currency}
                          </Feedback>
                        )}
                        {props.errors.hourlyRate == "err_network" ? (
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
                          props.touched.hourlyRate &&
                          props.errors.hourlyRate && (
                            <Feedback state="error">
                              {props.errors.hourlyRate}
                            </Feedback>
                          )
                        )}
                      </Flex>
                      <Feedback state="feedback">
                        We will never disclose this information - we use it to
                        help you when pricing your services
                      </Feedback>
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
