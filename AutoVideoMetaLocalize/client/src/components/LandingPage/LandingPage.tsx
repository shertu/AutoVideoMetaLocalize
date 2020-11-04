import { Row, Space, Typography } from 'antd/lib';
import * as React from 'react';
import { ApplicationRouteInfo, APPLICATION_NAME } from '../../constants';
import { AppPage } from '../AppPage/AppPage';
import { GoogleSignInButton } from '../GoogleSignInButton/GoogleSignInButton';
import { AppExplanationGrid } from './AppExplanationGrid/AppExplanationGrid';

const { Paragraph, Text, Title } = Typography;

const GOOGLE_AUTH_SCOPES: string[] = [
  // 'https://www.googleapis.com/auth/userinfo.profile',
];

/**
 * The home page of this web application.
 *
 * @return {JSX.Element}
 */
export function LandingPage(): JSX.Element {
  return (
    <AppPage style={{ minHeight: '100vh' }}>
      <Space direction="vertical" align="center" size="large">
        <Title>{APPLICATION_NAME}</Title >

        <Paragraph className="max-cell-xs">
          <Text strong>{APPLICATION_NAME}</Text> is a
          service which can localize the titles and descriptions
          of your YouTube videos to make them accessible to a larger audience.
        </Paragraph>

        <AppPage title="YouTube Authorization">
          <Paragraph className="max-cell-xs">To use this service please sign-in to Google and authorize this application to access your YouTube account.</Paragraph>

          <Row align="middle" justify="center" className="max-cell-xs" style={{ padding: '1em' }}>
            <GoogleSignInButton scopes={GOOGLE_AUTH_SCOPES} redirect={`~${ApplicationRouteInfo.ROUTE_PROCESS}`} />
          </Row>
        </AppPage>

        <AppPage title="How does it work?">
          <AppExplanationGrid />
        </AppPage>
      </Space>
    </AppPage>
  );
}
