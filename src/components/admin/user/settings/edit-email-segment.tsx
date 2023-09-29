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
} from '@revolancer/ui/forms';
import { Div, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

const UpdateEmailSchema = Yup.object().shape({
  email: Yup.string().optional().ensure(),
});

const EditEmailSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const loadEmailForUser = useCallback(async () => {
    axiosPrivate
      .get(`admin/user/email/${uid}`, { id: `admin-user-email-${uid}` })
      .then((response) => {
        setLoading(false);
        setEmail(response.data?.email ?? '');
      })
      .catch(() => {
        setLoading(false);
        setEmail('');
      });
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadEmailForUser();
    }
  }, [uid, loadEmailForUser]);

  const EditEmail = () => {
    return (
      <Formik
        initialValues={{
          email: email,
        }}
        validationSchema={UpdateEmailSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .post(`admin/user/email/${uid}`, { ...values })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('email', 'Oops, something went wrong');
              } else {
                setSuccess(true);
                await axiosPublic.storage.remove(`admin-user-email-${uid}`);
                await loadEmailForUser();
              }
            })
            .catch((reason) => {
              if (reason.response.data?.message == 'Conflict') {
                actions.setFieldError(
                  'email',
                  'Email already exists. Try again.',
                );
                return;
              }
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError('about', 'Oops, something went wrong');
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
              <H5>EMAIL</H5>
              <P css={{ color: '$neutral600' }}>Change users email</P>
              <Flex>
                <InputOuter error={props.touched.email && !!props.errors.email}>
                  <InputInner
                    name="email"
                    id="email"
                    placeholder="example@email.com"
                    aria-label="email"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.email}
                  />
                </InputOuter>
                <Button
                  href="#"
                  role="primary"
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
                  successMessage="Email has been updated"
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

  return EditEmail();
};

export default EditEmailSegment;
