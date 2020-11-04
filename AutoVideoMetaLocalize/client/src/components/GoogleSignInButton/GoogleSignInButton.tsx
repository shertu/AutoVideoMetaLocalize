import * as React from 'react';
import GoogleButton from 'react-google-button';
import { ApiAuthGoogleOAuthSignInGetRequest, BASE_PATH } from '../../../generated-sources/openapi';

/**
 * A button component used to sign in to the application via the Google Auth API.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function GoogleSignInButton(props: {
  scopes?: string[];
  redirect?: string;
}): JSX.Element {
  const {scopes, redirect} = props;

  const scopesdef = scopes ? scopes.join(' ') : 'https://www.googleapis.com/auth/userinfo.profile';
  const redirectdef = redirect || window.location.pathname;

  /** The click event for this button. */
  function onClick(): void {
    const requestParameters: ApiAuthGoogleOAuthSignInGetRequest = {
      postSignInRedirectUri: redirectdef,
      scope: scopesdef,
    };

    const searchParams: URLSearchParams = new URLSearchParams(requestParameters as URLSearchParams);

    const authorizationCodeRequestUrl: string = BASE_PATH + '/api/Auth/GoogleOAuthSignIn' + '?' + searchParams.toString();
    window.location.assign(authorizationCodeRequestUrl);
  }

  return (
    <GoogleButton type="light" onClick={onClick} />
  );
}
