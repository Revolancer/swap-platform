import { LocationInput } from '@/components/forms/location-input';
import { TimezoneSkeleton } from '@/components/skeletons/timezone';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { Feedback, Form } from '@revolancer/ui/forms';
import { Div, Flex } from '@revolancer/ui/layout';
import { H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

const UpdateTimezoneSchema = Yup.object().shape({
  location: Yup.object<google.maps.Place>().required(
    'Please select a location',
  ),
});

const EditTimeZoneSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<google.maps.Place | undefined>(
    undefined,
  );
  const [timezone, setTimezone] = useState('');

  const loadTimezone = useCallback(async () => {
    axiosPublic
      .get(`user/timezone/${uid}`, { id: `user-timezone-${uid}` })
      .then((response) => {
        setLoading(false);
        setTimezone(response.data.timezone ?? '');
      })
      .catch(() => {
        setLoading(false);
        setTimezone('');
      });
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadTimezone();
    }
  }, [uid, loadTimezone]);

  const EditTimeZone = () => {
    return (
      <Formik
        initialValues={{
          location: location,
        }}
        validationSchema={UpdateTimezoneSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .put('admin/user/edit/location', { ...values, userId: uid })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('timezone', 'Oops, something went wrong');
              } else {
                await axiosPublic.storage.remove(`user-timezone-${uid}`);
              }
            })
            .catch((reason) => {
              //TODO - error handling
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError('timezone', 'Oops, something went wrong');
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
              <H5>LOCATION & TIMEZONE</H5>
              <P css={{ color: '$neutral600' }}>Where do you work from?</P>
              <Flex>
                <LocationInput name="location" defaultValue={timezone} />
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
              {props.touched['location'] && props.errors['location'] && (
                <Feedback state="error">{props.errors['location']}</Feedback>
              )}
            </Form>
          );
        }}
      </Formik>
    );
  };

  if (loading || !timezone) return <TimezoneSkeleton />;

  return EditTimeZone();
};

export default EditTimeZoneSegment;
