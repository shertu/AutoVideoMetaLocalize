import * as React from 'react';


/**
 * A mailto link to the developer of this web application.
 *
 * @param {object} props
 * @param {string} props.subject
 * @param {string} props.children
 * @return {JSX.Element}
 */
export function MailToMe(props: {
  subject?: string,
  children?: React.ReactNode
}): JSX.Element {
  return (
    <a href={`mailto:djared.xeknau@outlook.com?subject=${props.subject}`}>
      {props.children}
    </a>
  );
};
