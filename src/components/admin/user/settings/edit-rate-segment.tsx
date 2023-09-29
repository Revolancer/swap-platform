import { SuccessModal } from '@/components/modals/success-modal';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import {
  Feedback,
  Form,
  InputInner,
  InputOuter,
  TextAreaInner,
  Select,
  SelectGroup,
  SelectItem,
} from '@revolancer/ui/forms';
import { Div, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

const HourlyRateSchema = Yup.object().shape({
  currency: Yup.string()
    .required('Please provide your currency')
    .oneOf(
      ['GBP', 'EUR', 'USD'],
      'Sorry, we do not currently support that currency. Please provide the equivalent rate in GBP, USD, or EUR',
    )
    .ensure(),
  hourlyRate: Yup.number()
    .required('Please provide your hourly rate')
    .min(5, 'We recommend charging more')
    .max(
      10000,
      'Your hourly rate is extremely high, we recommend a lower rate',
    ),
});

const EditRateSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [rate, setRate] = useState(0);
  const [success, setSuccess] = useState(false);
  const [currency, setCurrency] = useState('');

  const loadRateForUser = useCallback(async () => {
    axiosPrivate
      .get(`admin/user/rate/${uid}`, { id: `admin-user-rate-${uid}` })
      .then((response) => {
        setLoading(false);
        setRate(response.data?.hourly_rate ?? 0);
        setCurrency(response.data?.currency ?? '');
      })
      .catch(() => {
        setLoading(false);
        setRate(0);
        setCurrency('');
      });
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadRateForUser();
    }
  }, [uid, loadRateForUser]);

  const EditRate = () => {
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
            .post(`admin/user/rate/${uid}`, { ...values })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('email', 'Oops, something went wrong');
              } else {
                setSuccess(true);
                await axiosPublic.storage.remove(`admin-user-rate-${uid}`);
                await loadRateForUser();
              }
            })
            .catch((reason) => {
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError('currency', 'Oops, something went wrong');
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
            <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
              <Flex column>
                <H5>Hourly Rate</H5>
                <P css={{ color: '$neutral600' }}>Change users hourly rate</P>
                <Div
                  css={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '$4',

                    '@sm': {
                      gridTemplateColumns: '1fr 3fr',
                    },
                  }}
                >
                  <Select name="currency" placeholder="Currency">
                    <SelectGroup>
                      <SelectItem value="GBP">GBP £</SelectItem>
                      <SelectItem value="USD">USD $</SelectItem>
                      <SelectItem value="EUR">EUR €</SelectItem>
                    </SelectGroup>
                  </Select>
                  <InputOuter
                    error={
                      props.touched.hourlyRate && !!props.errors.hourlyRate
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
                  <Feedback state="error">{props.errors.currency}</Feedback>
                )}
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
                  successMessage="Hourly rate has been updated"
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

  if (loading) {
    return <SkeletonText type="p" css={{ width: '25%', marginTop: '$2' }} />;
  }

  return EditRate();
};

export default EditRateSegment;
