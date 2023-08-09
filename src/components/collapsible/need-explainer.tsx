import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '../layout/cards';
import { P } from '../text/text';
import { ProgressTraffic } from '../forms/progress-traffic';
import { Buttons } from '@revolancer/ui';
const { Link, UnstyledLink } = Buttons;
import { Flex } from '../layout/flex';
import { styled } from '@revolancer/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { CheckedProgressItem } from '../forms/checked-progress-item';
import { axiosPrivate, axiosPublic } from '@/lib/axios';
import store from '@/redux/store';
import { Divider } from '../layout/divider';

const Expander = styled('div', {
  borderRadius: '100%',
  borderStyle: '$solid',
  borderWidth: '$1',
  borderColor: '$neutral500',
  width: '$8',
  height: '$8',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$neutral600',
});

const CheckColumns = styled('div', {
  display: 'grid',
  gap: '$4',

  '@md': {
    gridTemplateRows: '1fr 1fr 1fr',
    gridAutoFlow: 'column',
  },

  '@lg': {
    gridTemplateRows: '1fr 1fr',
  },
});

export const NeedExplainer = () => {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <Card css={{ color: '$neutral600' }}>
      <Flex css={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
        <P
          css={{
            fontSize: '$body1',
            lineHeight: '$body1',
            fontWeight: '$bold',
            color: '$black',
          }}
        >
          💡 Not sure what to write? Here&rsquo;s a project brief guide!
        </P>
        {!expanded && (
          <UnstyledLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </UnstyledLink>
        )}
      </Flex>
      {expanded && (
        <>
          <P>
            By following this guide, candidates will gain a clear understanding
            of your project.
          </P>
          <P>
            <ol>
              <li>Background: Provide a brief overview of the business.</li>
              <li>
                Goal: Clearly state the main objective of the project, such as
                boosting brand awareness or driving conversions.
              </li>
              <li>
                Deliverables: Specify the expected end product and the desired
                file types. Indicate whether any materials will be provided.
              </li>
              <li>
                Preferences: Mention any design preferences, guidelines, or
                specific styles that should be considered.
              </li>
              <li>
                Limitations: Highlight any practical or technical constraints
                that may affect the project.
              </li>
            </ol>
          </P>
          <Divider />
          <UnstyledLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggle();
            }}
          >
            <Flex css={{ alignItems: 'center' }}>
              <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} />
              <P>Close Guide</P>
            </Flex>
          </UnstyledLink>
        </>
      )}
    </Card>
  );
};
