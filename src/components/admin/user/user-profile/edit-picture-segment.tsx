import { LocationInput } from '@/components/forms/location-input';
import { UploadField } from '@/components/forms/upload';
import { SuccessModal } from '@/components/modals/success-modal';
import { TimezoneSkeleton } from '@/components/skeletons/timezone';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { Feedback, Form } from '@revolancer/ui/forms';
import { Div, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

const UpdateImageSchema = Yup.object().shape({
  profileImage: Yup.string()
    .required('Please provide a profile picture. Maximum upload size is 40MB')
    .min(1, 'Please provide a profile picture. Maximum upload size is 40MB'),
});

const EditPictureSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [url, setUrl] = useState('');

  const loadImageForUser = useCallback(() => {
    axiosPublic
      .get(`user/profile_picture/${uid}`, { id: `user-image-${uid}` })
      .then((response) => {
        setLoading(false);
        setUrl(response.data?.timezone ?? '');
      })
      .catch(() => {
        setLoading(false);
        setUrl('');
      });
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadImageForUser();
    }
  }, [uid, loadImageForUser]);

  const EditImage = () => {
    return (
      <Formik
        initialValues={{
          profileImage: '',
        }}
        validationSchema={UpdateImageSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .put('admin/user/edit/profile_picture', { ...values, userId: uid })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError(
                  'profileImage',
                  'Oops, something went wrong',
                );
              } else {
                setSuccess(true);
                await axiosPublic.storage.remove(`user-image-${uid}`);
              }
            })
            .catch((reason) => {
              //TODO - error handling
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError(
                  'profileImage',
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
            <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
              <H5>PROFILE PICTURE</H5>
              <P css={{ color: '$neutral600' }}>Change users profile picture</P>
              <Flex>
                <UploadField name="profileImage" type="image" />
                <Button
                  href=""
                  role="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    props.submitForm();
                  }}
                >
                  Save
                </Button>
              </Flex>
              {success && (
                <SuccessModal
                  successMessage="Profile picture has been updated"
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

  if (loading) return <SkeletonText type="h3" />;

  return EditImage();
};

export default EditPictureSegment;
