import { SuccessModal } from '@/components/modals/success-modal';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { Feedback, Form, InputInner, InputOuter } from '@revolancer/ui/forms';
import { Div, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useState } from 'react';

const UpdateDOBSchema = Yup.object().shape({
  dob: Yup.string().optional().ensure(),
});

const EditDOBSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [dob, setDOB] = useState('');

  const loadDOBForUser = useCallback(async () => {
    axiosPrivate
      .get(`admin/user/dob/${uid}`, { id: `admin-user-dob-${uid}` })
      .then((response) => {
        setLoading(false);
        const dt = DateTime.fromISO(response.data?.date_of_birth);
        setDOB(dt.toFormat('yyyy-LL-dd'));
      })
      .catch(() => {
        setLoading(false);
      });
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadDOBForUser();
    }
  }, [uid, loadDOBForUser]);

  const EditDOB = () => {
    return (
      <Formik
        initialValues={{
          dob: dob,
        }}
        validationSchema={UpdateDOBSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .post(`admin/user/dob/${uid}`, { date_of_birth: values.dob })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('email', 'Oops, something went wrong');
              } else {
                setSuccess(true);
                setDOB(values.dob);
                await axiosPublic.storage.remove(`admin-user-dob-${uid}`);
                await loadDOBForUser();
              }
            })
            .catch((reason) => {
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError('dob', 'Oops, something went wrong');
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
              <H5>DATE OF BIRTH</H5>
              <P css={{ color: '$neutral600' }}>Change users date of birth</P>
              <Flex>
                <InputOuter error={props.touched.dob && !!props.errors.dob}>
                  <InputInner
                    name="dob"
                    type="date"
                    id="dob"
                    aria-label="date of birth"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.dob}
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
              {props.touched.dob && props.errors.dob && (
                <Feedback state="error">{props.errors.dob}</Feedback>
              )}
              {success && (
                <SuccessModal
                  successMessage="Date of birth has been updated"
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

  return EditDOB();
};

export default EditDOBSegment;
