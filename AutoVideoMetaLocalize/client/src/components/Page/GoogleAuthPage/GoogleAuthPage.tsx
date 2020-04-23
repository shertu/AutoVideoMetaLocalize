import * as React from 'react';
import './style.less';
import { Card, Typography, Row, Button } from 'antd';
import UserContext from '../../UserContext/UserContext';
import StepsContext from '../StepsPage/StepsContext/StepsContext';
import { GoogleSignInButton } from '../../GoogleSignInButton/GoogleSignInButton';
import { RightCircleOutlined } from '@ant-design/icons';
import { OAuthHandler } from '../../../security';
import { Page } from '../Page';

const { Title, Paragraph, Text } = Typography;

/**
 * A mailto link which provides the email address of the developer.
 *
 * @return {JSX.Element}
 */
export function GoogleAuthPage(props: {}): JSX.Element {
  const user = React.useContext(UserContext);
  const steps = React.useContext(StepsContext);

  const scopes: string[] = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/cloud-translation",
  ];

  function onClickContinue() {
    const newCurrent: number = steps.current + 1;

    steps.setCurrent(newCurrent);

    if (steps.currentMax < newCurrent) {
      steps.setCurrentMax(newCurrent);
    }
  }

  function onClickSignOut() {
    OAuthHandler.GoogleSignOut();
  }

  return (
    <Page id="google-auth-page">
      <Row justify="center">
        <Title level={2}>Authorize Application</Title>
      </Row>

      {!user && (
        <Row justify="center">
          <Paragraph className="max-cell-sm">
            This application requires permission from you to localize the titles and descriptions of the videos of <Text strong>your</Text> YouTube account.
          </Paragraph>

          <Row align="middle" justify="center" className="max-cell-sm">
            <GoogleSignInButton scopes={scopes} />
          </Row>
        </Row>
      )}

      {user && (
        <Row justify="end">
          <Button onClick={() => onClickSignOut()}>
            Change Account
          </Button>
          <Button onClick={() => onClickContinue()}>
            Continue <RightCircleOutlined />
          </Button>
        </Row>
      )}
    </Page>
  );
}
