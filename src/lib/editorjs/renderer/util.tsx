import { ExternalLink } from '@/components/links/external-link';
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

export const getTextContentFromNode = (node: any): string => {
  if (node.type === 'text') {
    return node.data;
  } else if (node.children) {
    return node.children.map(getTextContentFromNode).join('');
  }
  return '';
};
