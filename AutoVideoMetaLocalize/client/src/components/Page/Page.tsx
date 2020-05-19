import {Divider} from 'antd';
import * as React from 'react';


/**
 * A standard large full-width page to display a section of content.
 *
 * @param {object} props
 * @param {string} props.id
 * @param {React.ReactNode} props.children
 * @return {JSX.Element}
 */
export function Page(props: {
  id?: string,
  children?: React.ReactNode,
  title?: string,
}): JSX.Element {
  return (
    <section id={props.id} className="max-cell-lg">
      {props.title && (
        <Divider>{props.title}</Divider>
      )}
      {props.children}
    </section>
  );
};

