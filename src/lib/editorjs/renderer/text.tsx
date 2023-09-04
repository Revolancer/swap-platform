import { ExternalLink } from '@/components/links/external-link';
import { P } from '@revolancer/ui/text';
import { RenderFn } from 'editorjs-blocks-react-renderer';
import Linkify from 'linkify-react';
import { IntermediateRepresentation, OptFn } from 'linkifyjs';
import Parser, { HTMLReactParserOptions, Element } from 'html-react-parser';
import { LinkifiedText, stringToJSX, getTextContentFromNode } from './util.tsx';

export const Text: RenderFn<{
  text: string;
}> = ({ data, className = '' }) => {
  const parsedHTML = stringToJSX(data.text);
  return (
    <P css={{ margin: '$3 0' }}>
      <Linkify options={{ render: LinkifiedText }}>{parsedHTML}</Linkify>
    </P>
  );
};
