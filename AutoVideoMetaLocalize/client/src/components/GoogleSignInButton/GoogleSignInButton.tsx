import * as React from 'react';
import './style.less';
import GoogleButton from 'react-google-button';
import { OAuthHandler } from '../../security/authentication/oauth-handler';

/**
 * The ui element for when a switch statement falls through.
 *
 * @return {JSX.Element}
 */
export function GoogleSignInButton(): JSX.Element {
  const scopes: string[] = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/cloud-translation",
  ]

  return (
    <GoogleButton type="light" style={{ margin: 'auto' }}
      onClick={() => OAuthHandler.GoogleSignIn(null, scopes)}
    />
  );
}
