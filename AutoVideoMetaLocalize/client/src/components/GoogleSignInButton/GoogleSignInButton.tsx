import * as React from 'react';
import './style.less';
import GoogleButton from 'react-google-button';
import { OAuthHandler } from '../../security/authentication/oauth-handler';

/**
 * The ui element for when a switch statement falls through.
 *
 * @return {JSX.Element}
 */
export function GoogleSignInButton(props: {
  scopes?: string[],
}): JSX.Element {
  return (
    <GoogleButton type="light" style={{ margin: 'auto' }}
      onClick={() => OAuthHandler.GoogleSignIn(null, props.scopes)}
    />
  );
}
