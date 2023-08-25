import { axiosPrivate } from '@/lib/axios';
import { Form } from '../forms/form';
import { Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { useEffect, useState } from 'react';
import { SuccessModal } from '../modals/success-modal';
import { Flex } from '@revolancer/ui/layout';
import { Checkbox, Feedback } from '@revolancer/ui/forms';
import { P } from '@revolancer/ui/text';

export const ChangeEmailPreferences = () => {
  const [firstParty, setFirstParty] = useState(false);
  const [thirdParty, setThirdParty] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axiosPrivate
      .get('user/email_prefs')
      .then((res) => res.data)
      .then((data) => {
        setFirstParty(data.firstparty);
        setThirdParty(data.thirdparty);
        setLoaded(true);
      })
      .catch((e) => setLoaded(true));
  }, []);

  if (!loaded) return <></>;
  return (
    <Formik
      initialValues={{
        marketingfirstparty: firstParty,
        marketingthirdparty: thirdParty,
      }}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await axiosPrivate
          .post('user/email_prefs', values)
          .then(() => {
            setSuccess(true);
          })
          .catch((reason) => {
            if (reason.code == 'ERR_NETWORK') {
              actions.setFieldError(
                'marketingthirdparty',
                'Oops, something went wrong',
              );
            } else {
              const statuscode = Number(reason?.response?.status);
              switch (statuscode) {
                default:
                  actions.setFieldError(
                    'marketingthirdparty',
                    'Something went wrong',
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
          <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
            <Flex column>
              <Checkbox
                id="marketingfirstparty"
                name="marketingfirstparty"
                checked={props.values.marketingfirstparty}
              >
                I would like to receive updates about Revolancer
              </Checkbox>
              {props.touched.marketingfirstparty &&
                props.errors.marketingfirstparty && (
                  <Feedback state="error">
                    {props.errors.marketingfirstparty}
                  </Feedback>
                )}
              <Checkbox
                id="marketingthirdparty"
                name="marketingthirdparty"
                checked={props.values.marketingthirdparty}
              >
                I would like to receive updates about Revolancer&rsquo;s
                partners
              </Checkbox>
              {props.touched.marketingthirdparty &&
                props.errors.marketingthirdparty && (
                  <Feedback state="error">
                    {props.errors.marketingthirdparty}
                  </Feedback>
                )}
            </Flex>
            <P css={{ color: '$neutral700', fontStyle: 'italic' }}>
              Please note, some emails are required for the functionality of the
              site and cannot be disabled without closing your Revolancer
              account.
            </P>
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
                successMessage="Your email preferences have been updated"
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
