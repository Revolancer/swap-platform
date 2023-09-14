import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faGripVertical,
  faMinus,
  faPencil,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FieldArray, Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { ExternalLink } from '../links/external-link';
import { IntermediateRepresentation, OptFn } from 'linkifyjs';
import {
  formattedDomain,
  urlToIconsWithPriority,
} from './social-link-resolver-util';
import Linkify from 'linkify-react';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import { Form, InputInner, InputOuter } from '@revolancer/ui/forms';
import { SocialsSkeleton } from '../skeletons/socialsegment';

const UpdateSocialSchema = Yup.object().shape({
  socials: Yup.array()
    .of(Yup.string().required('Social link is required'))
    .min(1, 'At least one social link is required'),
});

const SocialIconLink: OptFn<(ir: IntermediateRepresentation) => any> = ({
  attributes,
}) => {
  const { href, css, ...props } = attributes;

  const socialIcon = urlToIconsWithPriority(href);

  return (
    <ExternalLink href={href} css={css} {...props}>
      <FontAwesomeIcon icon={socialIcon.icon} fontSize={25} />
    </ExternalLink>
  );
};

export const SocialSegment = ({
  uid = '',
  own = false,
  loading = true,
}: {
  uid: string;
  own?: boolean;
  loading?: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [socials, setSocials] = useState([]);
  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const loadSocialForUser = useCallback(async () => {
    axiosPublic
      .get(`user/socials/${uid}`, { id: `user-socials-${uid}` })
      .then((response) => setSocials(response.data?.links ?? ''))
      .catch(() => setSocials([]));
  }, [uid]);

  useEffect(() => {
    if (uid != '') {
      loadSocialForUser();
    }
  }, [uid, loadSocialForUser]);

  const StaticSocial = () => {
    return (
      <Flex
        css={{
          color: `${placeholder() ? '$neutral600' : '$neutral900'}`,
        }}
      >
        {placeholder()
          ? 'No socials added yet.'
          : socials.map(function (item, idx) {
              return (
                <Linkify
                  key={item}
                  options={{
                    render: SocialIconLink,
                    attributes: {
                      css: {
                        color: `${
                          placeholder() ? '$neutral600' : '$neutral800'
                        }`,
                      },
                    },
                  }}
                >
                  {item}
                </Linkify>
              );
            })}
      </Flex>
    );
  };

  const placeholder = () => {
    return socials.length == 0;
  };

  const EditSocial = () => {
    return (
      <Formik
        initialValues={{
          socials,
        }}
        validationSchema={UpdateSocialSchema}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true);
          await axiosPrivate
            .post('user/socials', { links: values.socials })
            .then(async (response) => {
              if (response.data?.success == 'false') {
                actions.setFieldError('socials', 'Oops, something went wrong');
              } else {
                await axiosPublic.storage.remove(`user-socials-${uid}`);
                await loadSocialForUser();
                toggleEdit();
              }
            })
            .catch((reason) => {
              //TODO - error handling
              if (reason.code == 'ERR_NETWORK') {
                actions.setFieldError('socials', 'Oops, something went wrong');
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
              <DragDropContext
                onDragEnd={(e) => {
                  console.log(e);
                  if (!e.destination) {
                    return;
                  }

                  const updatedSocials = [...props.values.socials];
                  const [reorderedItem] = updatedSocials.splice(
                    e.source.index,
                    1,
                  );
                  updatedSocials.splice(e.destination.index, 0, reorderedItem);
                  props.setFieldValue('socials', updatedSocials);
                }}
              >
                <Droppable droppableId="fieldList">
                  {(dropProvided) => (
                    <div
                      {...dropProvided.droppableProps}
                      ref={dropProvided.innerRef}
                    >
                      <FieldArray
                        name="socials"
                        render={(arrayHelpers) => {
                          return (
                            <>
                              {props.values.socials &&
                              props.values.socials.length > 0
                                ? props.values.socials.map((social, idx) => (
                                    <Draggable
                                      key={idx}
                                      draggableId={`${idx}`}
                                      index={idx}
                                    >
                                      {(dragProvided) => (
                                        <Flex
                                          ref={dragProvided.innerRef}
                                          {...dragProvided.draggableProps}
                                          {...dragProvided.dragHandleProps}
                                          css={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            margin: '$3 0',
                                          }}
                                        >
                                          {!formattedDomain(
                                            props.values.socials[idx],
                                          ) ? (
                                            <ExternalLink
                                              href={
                                                props.values.socials[idx] == ''
                                                  ? '#'
                                                  : props.values.socials[idx]
                                              }
                                              css={{
                                                color: `${
                                                  placeholder()
                                                    ? '$neutral600'
                                                    : '$neutral800'
                                                }`,
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faGlobe}
                                                fontSize={25}
                                              />
                                            </ExternalLink>
                                          ) : (
                                            <Linkify
                                              options={{
                                                render: SocialIconLink,
                                                attributes: {
                                                  css: {
                                                    color: `${
                                                      placeholder()
                                                        ? '$neutral600'
                                                        : '$neutral800'
                                                    }`,
                                                  },
                                                },
                                              }}
                                            >
                                              {props.values.socials[idx]}
                                            </Linkify>
                                          )}
                                          <InputOuter
                                            css={{
                                              width: '80%',
                                            }}
                                            error={
                                              props.touched.socials &&
                                              !!props.errors.socials &&
                                              typeof props.errors.socials ==
                                                'object' &&
                                              typeof props.errors.socials[
                                                idx
                                              ] == 'string' &&
                                              props.errors.socials[idx].length >
                                                0
                                            }
                                          >
                                            <InputInner
                                              name={`socials.${idx}`}
                                              key={`socials.${idx}`}
                                              onChange={props.handleChange}
                                              onBlur={props.handleBlur}
                                              value={props.values.socials[idx]}
                                              css={{
                                                width: '80%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                              }}
                                            />
                                            <Button
                                              href="#"
                                              role="secondary"
                                              size="small"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                arrayHelpers.remove(idx);
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faMinus}
                                                fontSize={10}
                                              />
                                            </Button>
                                          </InputOuter>
                                          <P css={{ color: '$neutral500' }}>
                                            <FontAwesomeIcon
                                              icon={faGripVertical}
                                              fontSize={20}
                                            />
                                          </P>
                                        </Flex>
                                      )}
                                    </Draggable>
                                  ))
                                : null}
                            </>
                          );
                        }}
                      />
                      {dropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <Flex css={{ justifyContent: 'space-between' }}>
                <Button
                  href="#"
                  role="secondary"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    props.setFieldValue('socials', [
                      ...props.values.socials,
                      '',
                    ]);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
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

  if (loading && socials.length === 0) return <SocialsSkeleton />;

  return (
    <>
      <Flex
        style={{
          justifyContent: own ? 'space-between' : 'flex-start',
          width: '100%',
        }}
      >
        <P css={{ color: '$neutral600' }}>Social</P>
        {own && (
          <FontAwesomeIcon
            onClick={toggleEdit}
            icon={faPencil}
            style={{ cursor: 'pointer' }}
          />
        )}
      </Flex>
      {(!own || !editMode) && StaticSocial()}
      {own && editMode && EditSocial()}
    </>
  );
};
