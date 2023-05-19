import { Flex } from "../layout/flex";
import { axiosPrivate } from "@/lib/axios";
import { Form } from "../forms/form";
import { Formik } from "formik";
import { Yup } from "@/lib/yup";
import { Button } from "../navigation/button";
import { InputInner, InputOuter } from "../forms/input";
import { Feedback } from "../forms/feedback";
import { H5 } from "../text/headings";
import { useEffect, useState } from "react";
import { SuccessModal } from "../navigation/success-modal";
import { Select, SelectGroup, SelectItem } from "../forms/select";
import { Div } from "../layout/utils";

const HourlyRateSchema = Yup.object().shape({
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

export const ChangeHourlyRate = () => {
  const [currency, setCurrency] = useState<string>();
  const [rate, setRate] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axiosPrivate
      .get("user/rate")
      .then((res) => res.data)
      .then((data) => {
        setCurrency(data.currency);
        setRate(data.hourly_rate);
        setLoaded(true);
      })
      .catch((e) => setLoaded(true));
  }, []);

  if (!loaded) return <></>;
  return (
    <Formik
      initialValues={{
        currency: currency,
        hourlyRate: rate,
      }}
      validationSchema={HourlyRateSchema}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await axiosPrivate
          .post("user/rate", values)
          .then(() => {
            setSuccess(true);
          })
          .catch((reason) => {
            if (reason.code == "ERR_NETWORK") {
              actions.setFieldError("currency", "Oops, something went wrong");
            } else {
              const statuscode = Number(reason?.response?.status);
              switch (statuscode) {
                default:
                  actions.setFieldError("currency", "Something went wrong");
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
            <Flex column>
              <H5>Hourly Rate</H5>
              <span>
                How much do you typically charge per hour for your services?
              </span>
              <Div
                css={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "$4",

                  "@sm": {
                    gridTemplateColumns: "1fr 3fr",
                  },
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
                  error={props.touched.hourlyRate && !!props.errors.hourlyRate}
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
                <Feedback state="error">{props.errors.currency}</Feedback>
              )}
              {props.touched.hourlyRate && props.errors.hourlyRate && (
                <Feedback state="error">{props.errors.hourlyRate}</Feedback>
              )}
              <Feedback state="feedback">
                We will never disclose this information - we use it to help you
                when pricing your services
              </Feedback>
            </Flex>
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
                successMessage="Your hourly rate has been updated"
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
