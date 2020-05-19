import {Row, Typography} from 'antd';
import * as React from 'react';
import routes from '../../routes';
import {GoogleSignInButton} from '../GoogleSignInButton/GoogleSignInButton';
import {Page} from '../Page/Page';
import {AppExplanationGrid} from './AppExplanationGrid/AppExplanationGrid';


const {Paragraph, Text} = Typography;

const GOOGLE_AUTH_SCOPES: string[] = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/cloud-translation',
];

/**
 * The main page of this web application.
 *
 * @return {JSX.Element}
 */
export function HomePage(): JSX.Element {
  return (
    <Page>
      <Row justify="center">
        <Paragraph className="max-cell-xs">
          Welcome to <Text strong>Auto Video Meta Localize.</Text>&nbsp;The
          service which can translate or localize the titles and descriptions
          of your YouTube videos to make them accessible to a larger audience.
        </Paragraph>
      </Row>

      <Page title="Account Sign-in">
        <Row justify="center">
          <Paragraph className="max-cell-xs">
            To use this service please sign-in to Google and authorize this application.
          </Paragraph>
        </Row>

        <Row justify="center" style={{marginBottom: '2em'}}>
          <GoogleSignInButton scopes={GOOGLE_AUTH_SCOPES} redirect={`~${routes.ROUTE_PROCESS}`} />
        </Row>
      </Page>

      <Page title="How does it work?">
        <AppExplanationGrid />
      </Page>
    </Page>
  );
}
