import { axiosPrivate } from '@/lib/axios';
import { Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { SuccessModal } from '../modals/success-modal';
import { useEffect, useState } from 'react';
import { Flex } from '@revolancer/ui/layout';
import { Form, InputInner, InputOuter, Feedback } from '@revolancer/ui/forms';
import { H5, Span } from '@revolancer/ui/text';

const UpdateEmailSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please provide a valid email address')
    .required('Please provide a valid email address'),
});

export const ChangeEmail = () => {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState<string>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axiosPrivate
      .get('user/email')
      .then((res) => res.data)
      .then((data) => {
        setEmail(data.email);
        setLoaded(true);
      })
      .catch((e) => setLoaded(true));
  }, []);

  if (!loaded) return <></>;
  return (
    <Formik
      initialValues={{
        email: email,
      }}
      validationSchema={UpdateEmailSchema}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await axiosPrivate
          .post('user/email', values)
          .then(() => {
            actions.resetForm();
            setSuccess(true);
          })
          .catch((reason) => {
            //TODO - error handling
            if (reason.code == 'ERR_NETWORK') {
              actions.setFieldError('email', 'Oops, something went wrong');
            } else {
              const statuscode = Number(reason?.response?.status);
              switch (statuscode) {
                case 409:
                  actions.setFieldError(
                    'email',
                    'That email address is already associated with a Revolancer account',
                  );
                  break;
                default:
                  actions.setFieldError('email', 'Something went wrong');
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
            <H5>Change Email</H5>
            <Span css={{ color: '$neutral700' }}>
              Type your new email address in the box below and click the Save
              button to change your email address.
            </Span>
            <Flex>
              <InputOuter error={props.touched.email && !!props.errors.email}>
                <InputInner
                  name="email"
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  aria-label="email"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.email}
                />
              </InputOuter>
              <Button
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  props.submitForm();
                }}
              >
                Save
              </Button>
            </Flex>
            {props.touched.email && props.errors.email && (
              <Feedback state="error">{props.errors.email}</Feedback>
            )}
            {success && (
              <SuccessModal
                successMessage="Your email address has been changed"
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
