import { Flex } from '../layout/flex';
import { axiosPrivate } from '@/lib/axios';
import { Form } from '../forms/form';
import { Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { InputInner, InputOuter, Slider } from '../forms/input';
import { Feedback } from '../forms/feedback';
import { H5 } from '../text/headings';
import { useEffect, useState } from 'react';
import { SuccessModal } from '../modals/success-modal';
import { Select, SelectGroup, SelectItem } from '../forms/select';
import { Div } from '../layout/utils';
import { P, Span } from '../text/text';

const ExperenceSchema = Yup.object().shape({
  experience: Yup.number().min(0).max(10),
});

export const ChangeExperience = () => {
  const [experience, setExperience] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axiosPrivate
      .get('user/experience')
      .then((res) => res.data)
      .then((data) => {
        setExperience(data.experience);
        setLoaded(true);
      })
      .catch((e) => setLoaded(true));
  }, []);

  if (!loaded) return <></>;
  return (
    <Formik
      initialValues={{
        experience: experience,
      }}
      validationSchema={ExperenceSchema}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        await axiosPrivate
          .post('user/experience', values)
          .then(() => {
            setSuccess(true);
          })
          .catch((reason) => {
            if (reason.code == 'ERR_NETWORK') {
              actions.setFieldError('experience', 'Oops, something went wrong');
            } else {
              const statuscode = Number(reason?.response?.status);
              switch (statuscode) {
                default:
                  actions.setFieldError('experience', 'Something went wrong');
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
            <Flex column>
              <H5>Experience</H5>
              <Span css={{ color: '$neutral700' }}>
                How many years of experience do you have in your field of work?
              </Span>
              <Slider name="experience" max={10} />
              <Flex
                css={{
                  justifyContent: 'space-between',
                  paddingInlineStart: '12px',
                  paddingInlineEnd: '4px',
                }}
              >
                <Span css={{ color: '$neutral700' }}>0</Span>
                <Span css={{ color: '$neutral700' }}>10+</Span>
              </Flex>
              {props.touched.experience && props.errors.experience && (
                <Feedback state="error">{props.errors.experience}</Feedback>
              )}
            </Flex>
            <Button
              href="#"
              onClick={(e) => {
                e.preventDefault();
                props.submitForm();
              }}
            >
              Save
            </Button>
            {success && (
              <SuccessModal
                successMessage="Your experience level has been updated"
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
