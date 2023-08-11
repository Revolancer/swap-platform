import { styled } from '@revolancer/ui';
import { Div } from '../layout/utils';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Form } from '../forms/form';
import { Flex } from '../layout/flex';
import { Button } from '@revolancer/ui/buttons';
import { Formik } from 'formik';
import { UploadField } from '../forms/upload';
import { Yup } from '@/lib/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

const UpdateImageSchema = Yup.object().shape({
  profileImage: Yup.string()
    .required('Please provide a profile picture. Maximum upload size is 40MB')
    .min(1, 'Please provide a profile picture. Maximum upload size is 40MB'),
});

export const ProfileImage = ({
  uid = '',
  own = false,
}: {
  uid: string;
  own?: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [url, setUrl] = useState('');

  const toggleEdit = () => {
    setEditMode(!editMode);
    loadImageForUser();
  };

  const loadImageForUser = useCallback(() => {
    axiosPublic
      .get(`user/profile_picture/${uid}`, { id: `user-image-${uid}` })
      .then((response) => setUrl(response.data?.profile_image ?? ''))
      .catch(() => setUrl(''));
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadImageForUser();
    }
  }, [uid, loadImageForUser]);

  const ProfileImageContainer = styled('div', {
    backgroundColor: '$neutral300',
    overflow: 'hidden',
    width: `128px`,
    height: `128px`,
    borderRadius: '$2',
  });

  const ProfileImage = styled(Image, {
    objectFit: 'cover',
  });

  const StaticImage = () => {
    return (
      <Flex>
        <ProfileImageContainer>
          {url != '' && (
            <>
              <ProfileImage
                src={url}
                height={128}
                width={128}
                alt={
                  own ? 'Your profile picture' : "This user's profile picture"
                }
                onClick={() => {
                  if (own) toggleEdit();
                }}
                css={{ cursor: `${own && 'pointer'}` }}
              ></ProfileImage>
            </>
          )}
        </ProfileImageContainer>
        {own && (
          <FontAwesomeIcon
            onClick={toggleEdit}
            icon={faPencil}
            style={{ cursor: 'pointer' }}
          />
        )}
      </Flex>
    );
  };

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
            .post('user/profile_picture', values)
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError(
                  'profileImage',
                  'Oops, something went wrong',
                );
              } else {
                await axiosPublic.storage.remove(`user-image-${uid}`);
                await toggleEdit();
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
              <UploadField name="profileImage" type="image" />
              <Flex css={{ flexDirection: 'row-reverse' }}>
                <Button
                  href="#"
                  role="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleEdit();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  href=""
                  role="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    props.submitForm();
                  }}
                >
                  Save
                </Button>
              </Flex>
            </Form>
          );
        }}
      </Formik>
    );
  };

  return (
    <>
      {(!own || !editMode) && StaticImage()}
      {own && editMode && EditImage()}
    </>
  );
};
