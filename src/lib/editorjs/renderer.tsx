import { ExternalLink } from '@/components/links/external-link';
import { P } from '@revolancer/ui/text';
import { RenderFn } from 'editorjs-blocks-react-renderer';
import Linkify from 'linkify-react';
import { IntermediateRepresentation, OptFn } from 'linkifyjs';
import Parser, { HTMLReactParserOptions, Element } from 'html-react-parser';
import { ReactNode } from 'react';

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
  console.log(data);
  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (node instanceof Element && node.attribs && node.children) {
        if (node.name === 'a') {
          return (
            <ExternalLink href={node.attribs.href}>
              {node.children as ReactNode}
            </ExternalLink>
          );
        }
      }
    },
  };

  const parsedHTML = Parser(data.text, options);
  return (
    <P css={{ margin: '$3 0' }}>
      <Linkify options={{ render: LinkifiedText }}>{parsedHTML}</Linkify>
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

// export const CustomLinkRenderer: RenderFn<{
//   anchor: string;
//   link: string;
// }> = ({ data }) => {
//   console.log(data);
//   return <ExternalLink href={data.link}>{data.anchor}</ExternalLink>;
// };
