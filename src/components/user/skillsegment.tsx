import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { Tag } from '@/lib/types';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { TagElement } from '../tags';
import { TagField } from '../forms/taginput';
import { Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { Form } from '@revolancer/ui/forms';
import { SkillSkeleton } from '../skeletons/skillsegment';

export const SkillSegment = ({
  uid = '',
  own = false,
  loading = true,
}: {
  uid: string;
  own?: boolean;
  loading?: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const toggleEdit = () => {
    setEditMode(!editMode);
  };

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

  const StaticTags = () => {
    const staticTags = [];
    for (const tag of tags) {
      staticTags.push(<TagElement tag={tag} key={tag.id} />);
    }
    return <Flex wrap>{staticTags}</Flex>;
  };

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
            .post('user/skills', values)
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('skills', 'Oops, something went wrong');
              } else {
                await axiosPublic.storage.remove(`user-skills-${uid}`);
                await loadTagsForUser();
                toggleEdit();
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
              <TagField name="skills" />
              <Flex css={{ flexDirection: 'row-reverse' }}>
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

  if (loading || tags.length === 0) return <SkillSkeleton />;

  return (
    <>
      <Flex
        style={{
          justifyContent: own ? 'space-between' : 'flex-start',
          width: '100%',
        }}
      >
        <P css={{ color: '$neutral600' }}>Skills</P>
        {own && (
          <FontAwesomeIcon
            onClick={toggleEdit}
            icon={faPencil}
            style={{ cursor: 'pointer' }}
          />
        )}
      </Flex>
      {(!own || !editMode) && StaticTags()}
      {own && editMode && EditTags()}
    </>
  );
};
