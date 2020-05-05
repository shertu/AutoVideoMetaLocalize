import * as React from 'react';
import {Page} from '../Page';
import './style.less';
import {Channel, ApiYouTubeVideoTranslatePostRequest} from '../../../../generated-sources/openapi';
import {ExecuteRequestStep} from './ExecuteRequestStep/ExecuteRequestStep';
import {StepsStateProvider} from './StepsStateContext/StepsStateContext';
import {SetChannelPage} from './SetChannelPage/SetChannelPage';
import {SetRequestPage} from './SetRequestPage/SetRequestPage';

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ProcessPage(): JSX.Element {
  const [stepsCurrent, setStepsCurrent] =
    React.useState<number>(0);

  const [channel, setChannel] =
    React.useState<Channel>(null);

  const [request, setRequest] =
    React.useState<ApiYouTubeVideoTranslatePostRequest>(null);

  const content: React.ReactNode[] = [
    <SetChannelPage
      key={0}
      setChannelStateAction={setChannel}
    />,
    <SetRequestPage
      key={1}
      channel={channel}
      setRequest={setRequest}
    />,
    (<ExecuteRequestStep
      key={2}
      request={request}
    />),
  ];

  return (
    <Page>
      <StepsStateProvider value={{
        value: stepsCurrent,
        setValue: setStepsCurrent,
      }}>
        <div className="steps-content">{content[stepsCurrent]}</div>
      </StepsStateProvider>
    </Page>
  );
}

// <Steps current={current}>
//  {steps.map(item => (
//    <Step key={item.title} title={item.title} />
//  ))}
// </Steps>
