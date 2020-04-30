import * as React from 'react';
import './style.less';

/**
 * A standard large full-width page to display a section of content.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function Page(props: {
  id?: string,
  children?: React.ReactNode
}): JSX.Element {
  return (
    <section id={props.id} className="max-cell-lg">
      {props.children}
    </section>
  );
};

