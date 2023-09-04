import { P } from '@revolancer/ui/text';
import { RenderFn } from 'editorjs-blocks-react-renderer';
import Linkify from 'linkify-react';
import { LinkifiedText, stringToJSX } from './util';

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
