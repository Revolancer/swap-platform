import { useState } from 'react';
import { Flex } from '../layout/flex';
import { P } from '../text/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faMinus,
  faPencil,
  faPlus,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { Form } from '../forms/form';
import { FieldArray, Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { InputInner, InputOuter } from '../forms/input';
import { ExternalLink } from '../links/external-link';
import { IntermediateRepresentation, OptFn } from 'linkifyjs';
import {
  formattedDomain,
  urlToIconsWithPriority,
} from './social-link-resolver-util';
import Linkify from 'linkify-react';

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
}: {
  uid: string;
  own?: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [socials, _] = useState([]);
  const toggleEdit = () => {
    setEditMode(!editMode);
  };

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
    return own && socials.length == 0;
  };

  const EditSocial = () => {
    return (
      <Formik
        initialValues={{
          socials,
        }}
        validationSchema={UpdateSocialSchema}
        onSubmit={async (values, actions) => {
          console.log(values, actions);
        }}
      >
        {(props) => {
          return (
            <Form onSubmit={props.handleSubmit} css={{ gap: '$3' }}>
              <FieldArray
                name="socials"
                render={(arrayHelpers) => {
                  return (
                    <>
                      {props.values.socials && props.values.socials.length > 0
                        ? props.values.socials.map((social, idx) => (
                            <InputOuter
                              css={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '$1',
                              }}
                              key={`socials.${idx}`}
                              error={
                                props.touched.socials &&
                                !!props.errors.socials &&
                                typeof props.errors.socials == 'object' &&
                                typeof props.errors.socials[idx] == 'string' &&
                                props.errors.socials[idx].length > 0
                              }
                            >
                              {!formattedDomain(props.values.socials[idx]) ? (
                                <ExternalLink
                                  href={props.values.socials[idx]}
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
                                <FontAwesomeIcon icon={faMinus} fontSize={20} />
                              </Button>
                            </InputOuter>
                          ))
                        : null}
                      <Flex>
                        <Button
                          href="#"
                          role="secondary"
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            props.submitForm();
                          }}
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </Button>
                        <Button
                          href="#"
                          role="secondary"
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            arrayHelpers.push('');
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                      </Flex>
                    </>
                  );
                }}
              />
            </Form>
          );
        }}
      </Formik>
    );
  };

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
