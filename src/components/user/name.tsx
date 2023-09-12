import { useCallback, useEffect, useState } from 'react';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Button } from '@revolancer/ui/buttons';
import { Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { Flex } from '@revolancer/ui/layout';
import { Form, InputInner, InputOuter, Feedback } from '@revolancer/ui/forms';
import { H1, H2 } from '@revolancer/ui/text';
import { SkeletonText } from '@revolancer/ui/skeleton';

const UpdateNameSchema = Yup.object().shape({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
});

export const Name = ({
  uid = '',
  own = false,
}: {
  uid: string;
  own?: boolean;
}) => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const toggleEdit = () => {
    setEditMode(!editMode);
  };

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

  const StaticName = () => {
    return (
      <H1
        css={{
          fontSize: '$h4m',
          lineHeight: '$h4m',
          '@md': { fontSize: '$h4', lineHeight: '$h4' },
        }}
      >
        {firstName} {lastName}{' '}
        {own && (
          <FontAwesomeIcon
            onClick={toggleEdit}
            icon={faPencil}
            style={{ cursor: 'pointer' }}
          />
        )}
      </H1>
    );
  };

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
            .post('user/name', values)
            .then(async (response) => {
              if (response.data?.success == 'false') {
                setFirstName(values.first_name);
                setLastName(values.last_name);
                actions.setFieldError(
                  'last_name',
                  'Oops, something went wrong',
                );
              } else {
                await axiosPublic.storage.remove(`user-name-${uid}`);
                toggleEdit();
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
            <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
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
              {props.touched.last_name && props.errors.last_name && (
                <Feedback state="error">{props.errors.last_name}</Feedback>
              )}
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
              {props.touched.first_name && props.errors.first_name && (
                <Feedback state="error">{props.errors.first_name}</Feedback>
              )}
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
                  href="#"
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

  if (loading) {
    return <SkeletonText type="h4" />;
  }

  return (
    <>
      {(!own || !editMode) && StaticName()}
      {own && editMode && EditName()}
    </>
  );
};
