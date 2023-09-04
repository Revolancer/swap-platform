import React from 'react';
import { RenderFn } from 'editorjs-blocks-react-renderer';
import { stringToJSX } from './util';

export interface HeaderBlockData {
  text: string;
  level: number;
}

export const Header: RenderFn<HeaderBlockData> = ({ data, className = '' }) => {
  const props: {
    [s: string]: string;
  } = {};

  if (className) {
    props.className = className;
  }

  const Tag = `h${data?.level || 1}` as keyof JSX.IntrinsicElements;
  return <Tag {...props}>{data?.text && stringToJSX(data.text)}</Tag>;
};
