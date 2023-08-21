import { useCallback, useEffect, useState } from 'react';
import { Flex } from '../layout/flex';
import { P } from '../text/text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import { Form } from '../forms/form';
import { Formik } from 'formik';
import { Yup } from '@/lib/yup';
import { Button } from '@revolancer/ui/buttons';
import { InputOuter, TextAreaInner } from '../forms/input';
import { Feedback } from '../forms/feedback';
import { BrandPriority } from '@/lib/types';
import { ExternalLink } from '../links/external-link';
import { IntermediateRepresentation, OptFn } from 'linkifyjs';
import { urlToIconsWithPriority } from './social-link-resolver-util';
import Linkify from 'linkify-react';
import { Div } from '../layout/utils';

const UpdateAboutSchema = Yup.object().shape({
  about: Yup.string().optional().ensure(),
});

const SocialIconLink: OptFn<(ir: IntermediateRepresentation) => any> = ({
  attributes,
  content,
}) => {
  const { href, ...props } = attributes;
  const socialIcon = urlToIconsWithPriority(href);

  return (
    <ExternalLink href={href} {...props}>
      <FontAwesomeIcon icon={socialIcon.icon} />
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
  const [social, setSocial] = useState(['github.com', 'www.gitlab.com']);
  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const StaticSocial = () => {
    return (
      <Flex css={{ color: `${placeholder() ? '$neutral600' : '$neutral800'}` }}>
        {placeholder()
          ? 'No socials added yet.'
          : social.map(function (item, idx) {
              return (
                <Linkify key={item} options={{ render: SocialIconLink }}>
                  {item}
                </Linkify>
              );
            })}
      </Flex>
    );
  };

  const placeholder = () => {
    return own && social.length == 0;
  };

  const EditSocial = () => {
    return <Div></Div>;
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
