import { ExternalLink } from '../links/external-link';
import { IntermediateRepresentation, OptFn } from 'linkifyjs';

export const renderLinksInMessages: OptFn<
  (ir: IntermediateRepresentation) => any
> = ({ attributes, content }) => {
  const { href, ...props } = attributes;
  return (
    <ExternalLink href={href} {...props}>
      {content}
    </ExternalLink>
  );
};
