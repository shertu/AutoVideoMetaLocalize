import {Button} from 'antd';
import * as React from 'react';
import { GoogleAuthApi } from '../../../generated-sources/openapi';

const GOOGLE_AUTH_API: GoogleAuthApi = new GoogleAuthApi();

/**
 * A sign-out button which uses the Google Auth API.
 *
 * @param {object} props
 * @param {string} props.redirect The uri to redirect the user to after sign-out.
 * @return {JSX.Element}
 */
export function GoogleSignOutButton(props: {
  redirect?: string;
}): JSX.Element {
  const { redirect } = props;

  /** The click event for this button. */
  async function onClick(): Promise<void> {
    await GOOGLE_AUTH_API.apiGoogleAuthAuthenticationRedirectUriPost({
      uri: redirect || window.location.pathname,
    });

    const res = await GOOGLE_AUTH_API.apiGoogleAuthGoogleSignOutGetRaw();

    window.location.assign(res.raw.url);
  }

  return (
    <Button onClick={onClick}>Sign Out</Button>
  );
}
