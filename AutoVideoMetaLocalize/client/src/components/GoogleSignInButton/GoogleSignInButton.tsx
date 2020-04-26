import * as React from 'react';
import './style.less';
import GoogleButton from 'react-google-button';
import { GoogleAuthApi } from '../../../generated-sources/openapi';

const GOOGLE_AUTH_API: GoogleAuthApi = new GoogleAuthApi();

/**
 * A sign-in button which uses the Google Auth API.
 *
 * @return {JSX.Element}
 */
export function GoogleSignInButton(props: {
  scopes?: string[],
}): JSX.Element {
  const scope: string = props.scopes.join(' ') || null;

  async function onClick(): Promise<void> {
    // set the authentication redurect uri
    GOOGLE_AUTH_API.apiGoogleAuthAuthenticationRedirectUriPost({
      uri: window.location.pathname,
    });

    // fetch the authorization url
    const authorizationUrl: string = await GOOGLE_AUTH_API.apiGoogleAuthAuthorizationRequestUrlGet({
      scope: scope
    });

    // redirect to the authorization url
    window.location.assign(authorizationUrl);
  }

  return (
    <GoogleButton type="light" style={{ margin: 0 }} onClick={onClick}/>
  );
}
