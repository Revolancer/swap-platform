import { Tag } from '@/lib/types';
import { Flex } from '@revolancer/ui/layout';
import { P } from '@revolancer/ui/text';
import Image from 'next/image';

export const NoResultsFound = ({
  term,
  tag,
}: {
  term?: string;
  tag?: Tag[];
}) => (
  <Flex column gap={5} css={{ alignItems: 'center', textAlign: 'center' }}>
    <P>Sorry, we couldn’t find any results for “{term}”.</P>
    <Image
      src="/img/revy/Revy_Confused.png"
      alt="Revy, happy to guide you back to safety"
      width={210}
      height={314}
    />
    <P>
      Make sure all words are spelled correctly, or try searching for simpler
      terms.
    </P>
  </Flex>
);
