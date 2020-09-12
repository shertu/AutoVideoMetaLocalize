import * as React from 'react';
import GoogleButton from 'react-google-button';
import {GoogleAuthApi} from '../../../generated-sources/openapi';

const GOOGLE_AUTH_API: GoogleAuthApi = new GoogleAuthApi();

/**
 * A sign-in button which uses the Google Auth API.
 *
 * @param {object} props
 * @param {string[]} props.scopes The Google OAuth 2.0 scopes - see https://developers.google.com/identity/protocols/oauth2/scopes for more information.
 * @param {string} props.redirect The uri to redirect the user to after sign-in.
 * @return {JSX.Element}
 */
export function GoogleSignInButton(props: {
  scopes?: string[];
  redirect?: string;
}): JSX.Element {
  const scopes: string[] = props.scopes || ['https://www.googleapis.com/auth/userinfo.profile'];
  const redirect: string = props.redirect || window.location.pathname;

  /** The click event for this button. */
  async function onClick(): Promise<void> {
    await GOOGLE_AUTH_API.apiGoogleAuthAuthenticationRedirectUriPost({
      uri: redirect,
    });

    const authorizationCodeRequestUrl: string = await GOOGLE_AUTH_API.apiGoogleAuthAuthorizationCodeRequestUrlGet({
      scope: scopes.join(' '),
    });

    window.location.assign(authorizationCodeRequestUrl);
  }

  return (
    <GoogleButton type="light" onClick={onClick}/>
  );
}
