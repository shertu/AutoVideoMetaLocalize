import { Row, Typography, Space } from 'antd';
import * as React from 'react';
import routes from '../../routes';
import { GoogleSignInButton } from '../GoogleSignInButton/GoogleSignInButton';
import { Page } from '../Page/Page';
import { AppExplanationGrid } from './AppExplanationGrid/AppExplanationGrid';
import names from '../../names';

const { Paragraph, Text, Title } = Typography;

const GOOGLE_AUTH_SCOPES: string[] = [
  // 'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  //'https://www.googleapis.com/auth/cloud-translation',
];

/**
 * The main page of this web application.
 *
 * @return {JSX.Element}
 */
export function HomePage(): JSX.Element {
  return (
    <Space direction="vertical" align="center" size="large">
      <Title>{names.APPLICATION}</Title >

      <Paragraph className="max-cell-xs">
        <Text strong>{names.APPLICATION}.</Text>&nbsp; a
        service which can localize the titles and descriptions
        of your YouTube videos to make them accessible to a larger audience.
      </Paragraph>

      <Page title="Account Sign-in">
        <Paragraph className="max-cell-xs">
          To use this service please sign-in to Google and authorize this application.
        </Paragraph>

        <div className="max-cell-xs" style={{ marginBottom: 24 }}>
          <GoogleSignInButton scopes={GOOGLE_AUTH_SCOPES} redirect={`~${routes.ROUTE_PROCESS}`} />
        </div>
      </Page>

      <Page title="How does it work?">
        <AppExplanationGrid />
      </Page>
    </Space>
  );
}
