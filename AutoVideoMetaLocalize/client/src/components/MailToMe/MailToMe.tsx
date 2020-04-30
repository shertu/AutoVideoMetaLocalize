import * as React from 'react';
import './style.less';

/**
 * A link to the email address of this web application's developer.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function MailToMe(props: {
  subject?: string,
  children?: React.ReactNode
}): JSX.Element {
  return (
    <a href={`mailto:djared.xeknau@outlook.com?subject=${props.subject}&`}>
      {props.children}
    </a>
  );
};
