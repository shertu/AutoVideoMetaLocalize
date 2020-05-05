import {Row, Typography} from 'antd';
import * as React from 'react';
import {Page} from '../Page';
import './style.less';
import UserContext from '../../UserContext/UserContext';
import {SelectChannelStepContent} from './SelectChannelStepContent/SelectChannelStepContent';
import {Channel, YouTubeVideoApi, ApiYouTubeVideoTranslatePostRequest} from '../../../../generated-sources/openapi';
import {ConfigurationStepContent} from './ConfigurationStepContent/ConfigurationStepContent';

const {Paragraph} = Typography;

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ProcessPage(): JSX.Element {
  const user = React.useContext(UserContext);

  const [current, setCurrent] =
    React.useState<number>(0);

  const [channel, setChannel] =
    React.useState<Channel>(null);

  const [videoTranslateRequest, setVideoTranslateRequest] =
    React.useState<ApiYouTubeVideoTranslatePostRequest>(null);

  /**
   * Go to the next page.
   */
  async function incrementCurrent() {
    setCurrent(current + 1);
  }

  /**
   * Go to the previous page.
   */
  async function decrementCurrent() {
    setCurrent(current - 1);
  }

  const content: React.ReactNode[] = [
    (<SelectChannelStepContent
      setChannelState={setChannel}
      onContinue={incrementCurrent}
    />),
    (<ConfigurationStepContent
      channel={channel}
      setVideoTranslateRequestState={setVideoTranslateRequest}
      onBack={decrementCurrent}
      onContinue={incrementCurrent}
    />),
  ];

  // render
  if (user == null) {
    return (
      <Row justify="center">
        <Paragraph className="max-cell-xs">
          To use this service please sign-in to YouTube.
        </Paragraph>
      </Row>
    );
  }

  return (
    <Page id="process-page">
      <div className="steps-content">{content[current]}</div>
      <div className="steps-action"></div>
    </Page>
  );
}

// <Steps current={current}>
//  {steps.map(item => (
//    <Step key={item.title} title={item.title} />
//  ))}
// </Steps>
