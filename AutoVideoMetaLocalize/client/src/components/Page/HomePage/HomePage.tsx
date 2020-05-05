import * as React from 'react';
import {Page} from '../Page';
import './style.less';
import {Typography, Row, Divider} from 'antd';
import {GoogleSignInButton} from '../../GoogleSignInButton/GoogleSignInButton';
import routes from '../../../routes';
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
    <Page id="home-page">
      <Row justify="center">
        <Paragraph className="max-cell-xs">
          Welcome to <Text strong>Auto Video Meta Localize.</Text>&nbsp;The
          service which can translate or localize the titles and descriptions
          of your YouTube videos to make them accessible to a larger audience.
        </Paragraph>
      </Row>

      <Page>
        <Divider>Account Sign-in</Divider>

        <Row justify="center">
          <Paragraph className="max-cell-xs">
            To use this service please sign-in to Google and authorize this application.
          </Paragraph>
        </Row>

        <Row justify="center" style={{marginBottom: '2em'}}>
          <GoogleSignInButton scopes={GOOGLE_AUTH_SCOPES} redirect={`~${routes.ROUTE_PROCESS}`} />
        </Row>
      </Page>

      <Page>
        <Divider>How does it work?</Divider>
        <AppExplanationGrid />
      </Page>
    </Page>
  );
}
