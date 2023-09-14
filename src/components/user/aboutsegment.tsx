import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import {
  Form,
  InputOuter,
  TextAreaInner,
  Feedback,
} from '@revolancer/ui/forms';
import { ExternalLink } from '../links/external-link';
import { IntermediateRepresentation, OptFn } from 'linkifyjs';
import Linkify from 'linkify-react';
import { SkeletonText } from '@revolancer/ui/skeleton';

export const renderLinksInAbout: OptFn<
  (ir: IntermediateRepresentation) => any
> = ({ attributes, content }) => {
  const { href, ...props } = attributes;
  return (
    <ExternalLink href={href} {...props}>
      {content}
    </ExternalLink>
  );
};

const UpdateAboutSchema = Yup.object().shape({
  about: Yup.string().optional().ensure(),
});

export const AboutSegment = ({
  uid = '',
  own = false,
  loading = true,
}: {
  uid: string;
  own?: boolean;
  loading?: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [about, setAbout] = useState('');
  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const loadAboutForUser = useCallback(async () => {
    axiosPublic
      .get(`user/about/${uid}`, { id: `user-about-${uid}` })
      .then((response) => setAbout(response.data?.about ?? ''))
      .catch(() => setAbout(''));
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadAboutForUser();
    }
  }, [uid, loadAboutForUser]);

  const StaticAbout = () => {
    return (
      <P css={{ color: `${placeholder ? '$neutral600' : '$neutral800'}` }}>
        {placeholder
          ? 'Tell us a bit about yourself'
          : about.split('\n').map(function (item, idx) {
              return (
                <Linkify key={idx} options={{ render: renderLinksInAbout }}>
                  {item}
                  <br />
                </Linkify>
              );
            })}
      </P>
    );
  };

  const placeholder = own && about == '';

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
            .post('user/about', values)
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('about', 'Oops, something went wrong');
              } else {
                await axiosPublic.storage.remove(`user-about-${uid}`);
                await loadAboutForUser();
                toggleEdit();
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
              {props.touched.about && props.errors.about && (
                <Feedback state="error">{props.errors.about}</Feedback>
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

  if (loading || !about) {
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

  return (
    <>
      <Flex
        style={{
          justifyContent: own ? 'space-between' : 'flex-start',
          width: '100%',
        }}
      >
        <P css={{ color: '$neutral600' }}>About</P>
        {own && (
          <FontAwesomeIcon
            onClick={toggleEdit}
            icon={faPencil}
            style={{ cursor: 'pointer' }}
          />
        )}
      </Flex>
      {(!own || !editMode) && StaticAbout()}
      {own && editMode && EditAbout()}
    </>
  );
};
