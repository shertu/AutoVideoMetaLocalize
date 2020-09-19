import * as React from 'react';
import GoogleButton from 'react-google-button';
import {GoogleAuthApi} from '../../../generated-sources/openapi';

const GOOGLE_AUTH_API: GoogleAuthApi = new GoogleAuthApi();

/**
 * A button component used to sign-in via the Google Auth API.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function GoogleSignInButton(props: {
  scopes?: string[];
  redirect?: string;
}): JSX.Element {
  const {scopes, redirect} = props;

  /** The click event for this button. */
  async function onClick(): Promise<void> {
    await GOOGLE_AUTH_API.apiGoogleAuthAuthenticationRedirectUriPost({
      uri: redirect || window.location.pathname,
    });

    const authorizationCodeRequestUrl: string = await GOOGLE_AUTH_API.apiGoogleAuthAuthorizationCodeRequestUrlGet({
      scope: scopes && scopes.join(' '),
    });

    window.location.assign(authorizationCodeRequestUrl);
  }

  return (
    <GoogleButton type="light" onClick={onClick}/>
  );
}
