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

const UpdateAboutSchema = Yup.object().shape({
  about: Yup.string().optional().ensure(),
});

const EditAboutSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [about, setAbout] = useState('');

  const loadAboutForUser = useCallback(async () => {
    axiosPublic
      .get(`user/about/${uid}`, { id: `user-about-${uid}` })
      .then((response) => {
        setLoading(false);
        setAbout(response.data?.about ?? '');
      })
      .catch(() => {
        setLoading(false);
        setAbout('');
      });
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadAboutForUser();
    }
  }, [uid, loadAboutForUser]);

  const EditAbout = () => {
    return (
      <Formik
        initialValues={{
          about: about,
        }}
        validationSchema={UpdateAboutSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .put('admin/user/edit/about', { ...values, userId: uid })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('about', 'Oops, something went wrong');
              } else {
                setSuccess(true);
                await axiosPublic.storage.remove(`user-about-${uid}`);
                await loadAboutForUser();
              }
            })
            .catch((reason) => {
              //TODO - error handling
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
              <H5>ABOUT</H5>
              <P css={{ color: '$neutral600' }}>Change users about</P>
              <Flex>
                <InputOuter error={props.touched.about && !!props.errors.about}>
                  <TextAreaInner
                    name="about"
                    id="about"
                    placeholder="Tell us a bit about you"
                    aria-label="about"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.about}
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
              {props.touched.about && props.errors.about && (
                <Feedback state="error">{props.errors.about}</Feedback>
              )}
              {success && (
                <SuccessModal
                  successMessage="About has been updated"
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
    return (
      <>
        <Flex
          style={{
            justifyContent: 'flex-start',
            width: '100%',
          }}
        >
          <P css={{ color: '$neutral600' }}>About</P>
        </Flex>
        {Array(3)
          .fill(null)
          .map((item, idx) => (
            <SkeletonText type="p" key={`p-${idx}`} css={{ marginTop: '$2' }} />
          ))}
        <SkeletonText type="p" css={{ width: '25%', marginTop: '$2' }} />
      </>
    );
  }

  return EditAbout();
};

export default EditAboutSegment;
