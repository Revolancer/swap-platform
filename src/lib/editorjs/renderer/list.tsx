import { RenderFn } from 'editorjs-blocks-react-renderer';
import Linkify from 'linkify-react';
import { LinkifiedText, stringToJSX } from './util';

export const List: RenderFn<{
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
