import { ExternalLink } from '@/components/links/external-link';
import { P } from '@revolancer/ui/text';
import { RenderFn } from 'editorjs-blocks-react-renderer';
import Linkify from 'linkify-react';
import { IntermediateRepresentation, OptFn } from 'linkifyjs';

export const LinkifiedText: OptFn<(ir: IntermediateRepresentation) => any> = ({
  attributes,
  content,
}) => {
  const { href, ...props } = attributes;
  return (
    <ExternalLink href={href} {...props}>
      {content}
    </ExternalLink>
  );
};

export const CustomTextRenderer: RenderFn<{
  text: string;
}> = ({ data, className = '' }) => {
  return (
    <P css={{ margin: '$3 0' }}>
      <Linkify options={{ render: LinkifiedText }}>{data.text}</Linkify>
    </P>
  );
};

export const CustomListRenderer: RenderFn<{
  items: string[];
}> = ({ data, className = '' }) => {
  return (
    <ol>
      {data?.items.map((item, i) => (
        <li key={i} className={className}>
          <Linkify options={{ render: LinkifiedText }}>{item}</Linkify>
        </li>
      ))}
    </ol>
  );
};
