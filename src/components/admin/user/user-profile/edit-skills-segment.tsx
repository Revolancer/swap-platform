import { LocationInput } from '@/components/forms/location-input';
import { TagField } from '@/components/forms/taginput';
import { SuccessModal } from '@/components/modals/success-modal';
import { SkillSkeleton } from '@/components/skeletons/skillsegment';
import { TimezoneSkeleton } from '@/components/skeletons/timezone';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Tag } from '@/lib/types';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { Feedback, Form } from '@revolancer/ui/forms';
import { Div, Flex } from '@revolancer/ui/layout';
import { H5, P } from '@revolancer/ui/text';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';

const SkillEditSchema = Yup.object().shape({
  skills: Yup.array()
    .of(Yup.object().shape({ id: Yup.string(), text: Yup.string() }))
    .required(
      "Please select some skills and tools to let us know what you're good at",
    )
    .min(3, 'Please select at least three skills or tools')
    .max(
      20,
      "Whoa there! That's a lot of skills! We want to know what you're best at, so please only provide 20 tags.",
    ),
});

const EditSkillsSegment = ({ uid }: { uid: string | string[] }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const loadTagsForUser = useCallback(async () => {
    axiosPublic
      .get(`user/skills/${uid}`, { id: `user-skills-${uid}` })
      .then((response) => setTags(response.data?.skills ?? []))
      .catch(() => setTags([]));
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadTagsForUser();
    }
  }, [uid, loadTagsForUser]);

  const EditTags = () => {
    return (
      <Formik
        initialValues={{
          skills: tags,
        }}
        validationSchema={SkillEditSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .put('admin/user/edit/skills', { ...values, userId: uid })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('skills', 'Oops, something went wrong');
              } else {
                setSuccess(true);
                await axiosPublic.storage.remove(`user-skills-${uid}`);
                await loadTagsForUser();
              }
            })
            .catch((reason) => {
              //TODO - error handling
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError('skills', 'Oops, something went wrong');
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
              <H5>SKILLS</H5>
              <P css={{ color: '$neutral600' }}>Change users skills</P>
              <TagField name="skills" />
              <Flex>
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
              {success && (
                <SuccessModal
                  successMessage="Skills has been updated"
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

  if (loading && tags.length === 0) return <SkillSkeleton />;

  return EditTags();
};

export default EditSkillsSegment;
