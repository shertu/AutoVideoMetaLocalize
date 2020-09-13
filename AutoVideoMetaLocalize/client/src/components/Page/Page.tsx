import { Divider } from 'antd';
import * as React from 'react';
import classNames from 'classnames';

export interface PageProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  title?: string,
}

/**
 * A standard large full-width page to display a section of content.
 *
 * @param {PageProps} props
 * @return {JSX.Element}
 */
export function Page(props: PageProps): JSX.Element {
  const { className, title, children, ...extra } = props;

  return (
    <section {...extra} className={classNames(className, 'max-cell-lg')}>
      {title && <Divider>{title}</Divider>}
      {children}
    </section>
  );
};

