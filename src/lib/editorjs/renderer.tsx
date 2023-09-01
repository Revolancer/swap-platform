import { ExternalLink } from '@/components/links/external-link';
import { P } from '@revolancer/ui/text';
import { RenderFn } from 'editorjs-blocks-react-renderer';
import Linkify from 'linkify-react';
import { IntermediateRepresentation, OptFn } from 'linkifyjs';
import Parser, { HTMLReactParserOptions, Element } from 'html-react-parser';

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

export const stringToJSX = (htmlString: string) => {
  if (typeof htmlString != 'string') return '';
  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (node instanceof Element && node.attribs && node.children) {
        if (node.name === 'a') {
          return (
            <ExternalLink href={node.attribs.href}>
              {getTextContentFromNode(node)}
            </ExternalLink>
          );
        }
      }
    },
  };

  return Parser(htmlString, options);
};

const getTextContentFromNode = (node: any): string => {
  if (node.type === 'text') {
    return node.data;
  } else if (node.children) {
    return node.children.map(getTextContentFromNode).join('');
  }
  return '';
};

export const CustomTextRenderer: RenderFn<{
  text: string;
}> = ({ data, className = '' }) => {
  const parsedHTML = stringToJSX(data.text);
  return (
    <P css={{ margin: '$3 0' }}>
      <Linkify options={{ render: LinkifiedText }}>{parsedHTML}</Linkify>
    </P>
  );
};

export const CustomListRenderer: RenderFn<{
  items: string[];
  style: string;
}> = ({ data, className = '' }) => {
  return data.style == 'unordered' ? (
    <ul>
      {data?.items.map((item, i) => (
        <li key={i} className={className}>
          <Linkify options={{ render: LinkifiedText }}>
            {stringToJSX(item)}
          </Linkify>
        </li>
      ))}
    </ul>
  ) : (
    <ol>
      {data?.items.map((item, i) => (
        <li key={i} className={className}>
          <Linkify options={{ render: LinkifiedText }}>
            {stringToJSX(item)}
          </Linkify>
        </li>
      ))}
    </ol>
  );
};
