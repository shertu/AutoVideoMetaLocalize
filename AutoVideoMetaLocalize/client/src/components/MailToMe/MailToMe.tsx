import * as React from 'react';
import Mailto from 'react-mailto.js';

export interface MailToMeProps extends React.HTMLAttributes<HTMLAnchorElement> {
  //to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  body?: string;
  secure?: boolean;
  children: React.ReactNode;
}

/**
 * A mailto link to the developer of this web application.
 *
 * @param {object} props
 * @param {string} props.subject
 * @param {string} props.children
 * @return {JSX.Element}
 */
export function MailToMe(props: MailToMeProps): JSX.Element {
  return (
    <Mailto {...props} to="djared.xeknau@outlook.com" />
  );
}