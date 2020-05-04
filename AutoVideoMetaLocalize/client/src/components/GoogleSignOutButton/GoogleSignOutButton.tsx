import * as React from 'react';
import './style.less';
import {GoogleAuthApi} from '../../../generated-sources/openapi';
import {Button} from 'antd';

const GOOGLE_AUTH_API: GoogleAuthApi = new GoogleAuthApi();

/**
 * A sign-out button which uses the Google Auth API.
 *
 * @param {object} props
 * @param {string} props.redirect The local url to redirect to after sign-in.
 * @return {JSX.Element}
 */
export function GoogleSignOutButton(props: {
  redirect?: string,
}): JSX.Element {
  const redirect: string = props.redirect || window.location.pathname;

  /**
  * The click event for this button.
  */
  async function onClick(): Promise<void> {
    // set the authentication redurect uri
    await GOOGLE_AUTH_API.apiGoogleAuthAuthenticationRedirectUriPost({
      uri: redirect,
    });

    // call the sign out
    const res = await GOOGLE_AUTH_API.apiGoogleAuthGoogleSignOutGetRaw();
    if (res.raw.redirected) {
      window.location.assign(res.raw.url);
    }
  }

  return (
    <Button onClick={onClick}>Sign Out</Button>
  );
}
