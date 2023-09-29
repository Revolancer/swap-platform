import { SuccessModal } from '@/components/modals/success-modal';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import {
  Feedback,
  Form,
  InputInner,
  InputOuter,
  Slider,
} from '@revolancer/ui/forms';
import { Div, Flex } from '@revolancer/ui/layout';
import { SkeletonText } from '@revolancer/ui/skeleton';
import { H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

const UpdateYOESchema = Yup.object().shape({
  yoe: Yup.string().optional().ensure(),
});

const EditYOESegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [yoe, setYOE] = useState(0);

  const loadYOEForUser = useCallback(async () => {
    axiosPrivate
      .get(`admin/user/experience/${uid}`, {
        id: `admin-user-experience-${uid}`,
      })
      .then((response) => {
        setLoading(false);
        setYOE(response.data?.experience ?? 0);
      })
      .catch(() => {
        setLoading(false);
        setYOE(0);
      });
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadYOEForUser();
    }
  }, [uid, loadYOEForUser]);

  const EditYOE = () => {
    return (
      <Formik
        initialValues={{
          yoe: yoe,
        }}
        validationSchema={UpdateYOESchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .post(`admin/user/experience/${uid}`, { experience: values.yoe })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('yoe', 'Oops, something went wrong');
              } else {
                setSuccess(true);
                await axiosPublic.storage.remove(
                  `admin-user-experience-${uid}`,
                );
                await loadYOEForUser();
              }
            })
            .catch((reason) => {
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError('yoe', 'Oops, something went wrong');
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
              <H5>YEARS OF EXPERIENCE</H5>
              <P css={{ color: '$neutral600' }}>
                Change users years of experience
              </P>
              <Flex css={{ width: '100%' }}>
                <P>{props.values.yoe}</P>
                <Div css={{ width: '100%' }}>
                  <Slider name="yoe" min={0} max={10} step={1} />
                  <Flex
                    css={{
                      justifyContent: 'space-between',
                      paddingInlineStart: '12px',
                      paddingInlineEnd: '4px',
                    }}
                  >
                    <span>0</span>
                    <span>10+</span>
                  </Flex>
                </Div>

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
              {props.touched.yoe && props.errors.yoe && (
                <Feedback state="error">{props.errors.yoe}</Feedback>
              )}
              {success && (
                <SuccessModal
                  successMessage="Years of experience has been updated"
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

  return EditYOE();
};

export default EditYOESegment;
