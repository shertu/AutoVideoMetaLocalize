import * as React from 'react';
import './style.less';
import GoogleButton from 'react-google-button';

//onClick = {() => AuthenticationNavigator.login({})} 

/**
 * The ui element for when a switch statement falls through.
 *
 * @return {JSX.Element}
 */
export function GoogleSignInButton(): JSX.Element {
  return (
    <GoogleButton type="light" style={{ margin: 'auto' }} />
  );
}
