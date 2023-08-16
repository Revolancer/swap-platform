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
import { faC, faClock, faPencil } from '@fortawesome/free-solid-svg-icons';
import { TzSelect } from '../forms/select';
import { P } from '../text/text';
import { DateTime } from 'luxon';
import { LocationInput } from '../forms/location-input';
import { Feedback } from '@/components/forms/feedback';
import { H5 } from '../text/headings';

const UpdateTimezoneSchema = Yup.object().shape({
  location: Yup.object<google.maps.Place>().required(
    'Please select a location',
  ),
});

export const Timezone = ({
  uid = '',
  own = false,
}: {
  uid: string;
  own?: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [location, setLocation] = useState<google.maps.Place | undefined>(
    undefined,
  );
  const [timezone, setTimezone] = useState('');

  const zoneOffset = (timezone: string) => {
    const dt = DateTime.now().setZone(timezone);
    const zonename = DateTime.now().setZone(timezone).offsetNameLong;
    const offsetMins = dt.offset;
    const offset = `${offsetMins >= 0 ? '+' : '-'}${Math.abs(offsetMins) / 60}`;
    return `${zonename} (UTC${offset})`;
  };

  const toggleEdit = () => {
    setEditMode(!editMode);
    loadTimezone();
  };

  const loadTimezone = useCallback(async () => {
    axiosPublic
      .get(`user/timezone/${uid}`, { id: `user-timezone-${uid}` })
      .then((response) => setTimezone(response.data?.timezone ?? ''))
      .catch(() => setTimezone(''));
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadTimezone();
    }
  }, [uid, loadTimezone]);

  const StaticTZ = () => {
    return (
      <P css={{ color: '$neutral800' }}>
        <FontAwesomeIcon icon={faClock} /> {zoneOffset(timezone)}{' '}
        {own && (
          <FontAwesomeIcon
            onClick={toggleEdit}
            icon={faPencil}
            style={{ cursor: 'pointer' }}
          />
        )}
      </P>
    );
  };

  const EditTimezone = () => {
    return (
      <Formik
        initialValues={{
          location: location,
        }}
        validationSchema={UpdateTimezoneSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .post('user/location', values)
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('timezone', 'Oops, something went wrong');
              } else {
                await axiosPublic.storage.remove(`user-timezone-${uid}`);
                toggleEdit();
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
              <H5>Location</H5>
              <P css={{ color: '$neutral600' }}>Where do you work from?</P>
              <LocationInput name="location" />
              {props.touched['location'] && props.errors['location'] && (
                <Feedback state="error">{props.errors['location']}</Feedback>
              )}
              <Feedback state="feedback">
                We will use this to determine the timezone to display on your
                profile. Your location will never be displayed.
              </Feedback>
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

  return (
    <>
      {(!own || !editMode) && StaticTZ()}
      {own && editMode && EditTimezone()}
    </>
  );
};
