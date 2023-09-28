import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { Feedback, Form, InputInner, InputOuter } from '@revolancer/ui/forms';
import { Div, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

const UpdateTaglineSchema = Yup.object().shape({
  tagline: Yup.string().optional().ensure(),
});

const EditTaglineSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [tagline, setTagline] = useState('');

  const loadTagline = useCallback(() => {
    axiosPublic
      .get(`user/tagline/${uid}`, { id: `user-tagline-${uid}` })
      .then((response) => {
        setLoading(false);
        setTagline(response.data?.tagline ?? '');
      })
      .catch(() => {
        setLoading(false);
        setTagline('');
      });
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadTagline();
    }
  }, [uid, loadTagline]);

  const EditTagline = () => {
    return (
      <Formik
        initialValues={{
          tagline: tagline,
        }}
        validationSchema={UpdateTaglineSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .put('admin/user/edit/tagline', { ...values, userId: uid })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('tagline', 'Oops, something went wrong');
              } else {
                await axiosPublic.storage.remove(`user-tagline-${uid}`);
              }
            })
            .catch((reason) => {
              //TODO - error handling
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError('tagline', 'Oops, something went wrong');
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
            <Form onSubmit={props.handleSubmit}>
              <H5>TAGLINE</H5>
              <P css={{ color: '$neutral600' }}>Change users tagline</P>
              <Flex>
                <InputOuter
                  error={props.touched.tagline && !!props.errors.tagline}
                >
                  <InputInner
                    type="text"
                    name="tagline"
                    id="tagline"
                    placeholder="Enter a tagline"
                    aria-label="Tagline"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.tagline}
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
                {props.touched.tagline && props.errors.tagline && (
                  <Feedback state="error">{props.errors.tagline}</Feedback>
                )}
              </Flex>
            </Form>
          );
        }}
      </Formik>
    );
  };

  if (loading) {
    return <SkeletonText type="h4" />;
  }

  return EditTagline();
};

export default EditTaglineSegment;
