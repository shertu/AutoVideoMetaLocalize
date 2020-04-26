import * as React from 'react';
import './style.less';
import { GoogleAuthApi } from '../../../generated-sources/openapi';
import { Button } from 'antd';

const GOOGLE_AUTH_API: GoogleAuthApi = new GoogleAuthApi();

/**
 * A sign-out button which uses the Google Auth API.
 *
 * @return {JSX.Element}
 */
export function GoogleSignOutButton(): JSX.Element {
  async function onClick(): Promise<void> {
    // set the authentication redurect uri
    GOOGLE_AUTH_API.apiGoogleAuthAuthenticationRedirectUriPost({
      uri: window.location.pathname,
    });

    // call the sign out
    GOOGLE_AUTH_API.apiGoogleAuthGoogleSignOutGet();
  }

  return (
    <Button onClick={onClick}>Sign Out</Button>
  );
}
