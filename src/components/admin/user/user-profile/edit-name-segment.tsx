import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { Feedback, Form, InputInner, InputOuter } from '@revolancer/ui/forms';
import { Div, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

const UpdateNameSchema = Yup.object().shape({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
});

const EditNameSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const loadName = useCallback(() => {
    axiosPublic
      .get(`user/name/${uid}`, { id: `user-name-${uid}` })
      .then((response) => {
        setFirstName(response.data?.first_name ?? '');
        setLastName(response.data?.last_name ?? '');
        setLoading(false);
      })
      .catch(() => {});
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadName();
    }
  }, [uid, loadName]);

  const EditName = () => {
    return (
      <Formik
        initialValues={{
          first_name: firstName,
          last_name: lastName,
        }}
        validationSchema={UpdateNameSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .put('admin/user/edit/name', { ...values, userId: uid })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError(
                  'last_name',
                  'Oops, something went wrong',
                );
              } else {
                setFirstName(values.first_name);
                setLastName(values.last_name);
                await axiosPublic.storage.remove(`user-name-${uid}`);
              }
            })
            .catch((reason) => {
              //TODO - error handling
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError(
                  'last_name',
                  'Oops, something went wrong',
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
            <Form onSubmit={props.handleSubmit}>
              <H5>NAME</H5>
              <P css={{ color: '$neutral600' }}>Change users name</P>
              <Flex>
                <InputOuter
                  error={props.touched.first_name && !!props.errors.first_name}
                >
                  <InputInner
                    type="text"
                    name="first_name"
                    id="first_name"
                    minLength={2}
                    maxLength={35}
                    placeholder="First Name"
                    aria-label="First Name"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.first_name}
                  />
                </InputOuter>
                <InputOuter
                  error={props.touched.last_name && !!props.errors.last_name}
                >
                  <InputInner
                    type="text"
                    name="last_name"
                    id="last_name"
                    minLength={2}
                    maxLength={35}
                    placeholder="Last Name"
                    aria-label="Last Name"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.last_name}
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
              {props.touched.first_name && props.errors.first_name && (
                <Feedback state="error">{props.errors.first_name}</Feedback>
              )}

              {props.touched.last_name && props.errors.last_name && (
                <Feedback state="error">{props.errors.last_name}</Feedback>
              )}
            </Form>
          );
        }}
      </Formik>
    );
  };

  if (loading) {
    return <SkeletonText type="h4" />;
  }

  return EditName();
};

export default EditNameSegment;
