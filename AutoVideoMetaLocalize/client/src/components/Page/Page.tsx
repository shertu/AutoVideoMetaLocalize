import {Divider} from 'antd';
import * as React from 'react';
import classNames from 'classnames';

export interface PageProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  title?: string,
}

/**
 * A large, full-width view component to display a section of content.
 *
 * @param {PageProps} props
 * @return {JSX.Element}
 */
export function Page(props: PageProps): JSX.Element {
  const {className, title, children, ...sectionProps} = props;

  return (
    <section {...sectionProps} className={classNames(className, 'max-cell-lg')}>
      {title && <Divider>{title}</Divider>}
      {children}
    </section>
  );
};
