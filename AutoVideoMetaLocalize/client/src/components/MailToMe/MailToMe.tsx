import * as React from 'react';

import { openComposer } from 'react-native-email-link'

export interface MailToMeProps {
  children?: React.ReactNode;
  app?: string | null;
  title?: string;
  message?: string;
  cancelLabel?: string;
  removeText?: boolean;
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
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
  function openEmail() {
    openComposer({
      ...props,
      to: 'djared.xeknau@example.com',
    })
  }

  return (
    <a onClick={openEmail}>{props.children}</a>
  );
};
