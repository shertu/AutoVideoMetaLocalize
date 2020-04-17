import * as React from 'react';
import './style.less';

/**
 * A mailto link which provides the email address of the developer.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export const MailToMe: React.FunctionComponent<{
  subject?: string,
}> = (props: { subject?: string, children: React.ReactNode }) => {
  return (
    <a href={`mailto:djared.xeknau@outlook.com?subject=${props.subject}&`}>
      {props.children}
    </a>
  );
};
