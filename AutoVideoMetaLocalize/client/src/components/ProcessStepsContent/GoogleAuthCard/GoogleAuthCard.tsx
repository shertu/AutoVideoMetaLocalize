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
  const scopes: string[] = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/cloud-translation",
  ];

  return (
    <FullWidthCell size="sm">
      <Card >
        <GoogleSignInButton scopes={scopes} />
      </Card>
    </FullWidthCell>
  );
}
