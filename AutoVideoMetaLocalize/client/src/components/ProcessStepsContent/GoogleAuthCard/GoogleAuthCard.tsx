import * as React from 'react';
import './style.less';
import { FullWidthCell } from '../../FullWidthCell/FullWidthCell';
import { Card } from 'antd';
import { GoogleSignInButton } from '../../GoogleSignInButton/GoogleSignInButton';

/**
 * The ui element for when a switch statement falls through.
 *
 * @return {JSX.Element}
 */
export function GoogleAuthCard(): JSX.Element {
  return (
    <FullWidthCell size="sm">
      <Card >
        <GoogleSignInButton />
      </Card>
    </FullWidthCell>
  );
}
