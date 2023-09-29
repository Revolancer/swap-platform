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

const EditPasswordSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const EditPassword = () => {
    return (
      <Formik
        initialValues={{
          success: '',
        }}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .put(`admin/user/password/${uid}`)
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('success', 'Oops, something went wrong');
              } else {
                setSuccess(true);
              }
            })
            .catch((reason) => {
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
              <H5>PASSWORD</H5>
              <P css={{ color: '$neutral600' }}>
                Send a password rest email to user
              </P>
              <Flex>
                <Button
                  disabled={props.isSubmitting}
                  href="#"
                  role="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    props.submitForm();
                  }}
                >
                  {props.isSubmitting ? 'Sending...' : 'Send Email'}
                </Button>
              </Flex>
              {props.touched.success && props.errors.success && (
                <Feedback state="error">{props.errors.success}</Feedback>
              )}
              {success && (
                <SuccessModal
                  successMessage="Reset password email has been sent."
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

  return EditPassword();
};

export default EditPasswordSegment;
