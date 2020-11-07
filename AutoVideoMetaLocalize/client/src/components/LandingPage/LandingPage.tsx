import {PageHeader, Space, Typography} from 'antd/lib';
import * as React from 'react';
import {ApplicationRouteInfo, APPLICATION_NAME} from '../../constants';
import {AutoColumnRow, AutoColumnRowGutterDefault} from '../AutoColumnRow/AutoColumnRow';
import {GoogleSignInButton} from '../GoogleSignInButton/GoogleSignInButton';
import {MaxCell} from '../MaxCell/MaxCell';
import {AppExplanationGrid} from './AppExplanationGrid/AppExplanationGrid';

const {Paragraph, Title} = Typography;

/**
 * The home page of this web application.
 *
 * @return {JSX.Element}
 */
export function LandingPage(): JSX.Element {
  return (
    <Space className="max-cell" direction="vertical" align="center" size={0}>
      <Title>{APPLICATION_NAME}</Title>

      <MaxCell>
        <PageHeader title="YouTube Authorization" />

        <AutoColumnRow align="middle" justify="center" gutter={[AutoColumnRowGutterDefault, AutoColumnRowGutterDefault]}>
          <Typography className="max-cell-xs">
            <Paragraph>
              To use this demo service please sign in to Google and authorize this application to manage your YouTube account.
              The application will read and edit the info in your YouTube channel and videos.
            </Paragraph>
          </Typography>

          <GoogleSignInButton redirect={`~${ApplicationRouteInfo.ROUTE_PROCESS}`} />
        </AutoColumnRow>

        <PageHeader title="How does it work?" />

        <AppExplanationGrid />
      </MaxCell>
    </Space>
  );
}
