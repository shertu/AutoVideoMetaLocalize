import * as React from 'react';
import './style.less';
import GoogleButton from 'react-google-button';
import { AuthenticationNavigator } from '../../authentication-navigator';

/**
 * The ui element for when a switch statement falls through.
 *
 * @return {JSX.Element}
 */
export function GoogleSignInButton(): JSX.Element {
  return (
    <GoogleButton type="light" onClick={() => AuthenticationNavigator.login({})} style={{ margin: 'auto' }} />
  );
}
