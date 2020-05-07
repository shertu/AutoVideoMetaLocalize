import {Divider} from 'antd';
import * as React from 'react';
import {ApiYouTubeVideoTranslatePostRequest, Channel} from '../../../../generated-sources/openapi';
import {Page} from '../Page';
import {SelectChannelForm} from './SelectChannelForm/SelectChannelForm';
import {SelectRequestForm} from './SelectRequestForm/SelectRequestForm';
import {StepsStateProvider} from './StepsStateContext/StepsStateContext';
import './style.less';
import {ExecuteProgress} from './ExecuteProgress/ExecuteProgress';

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ChannelTranslationPage(): JSX.Element {
  const [stepsCurrent, setStepsCurrent] =
    React.useState<number>(0);

  const [channel, setChannel] =
    React.useState<Channel>(null);

  const [request, setRequest] =
    React.useState<ApiYouTubeVideoTranslatePostRequest>(null);

  const content: React.ReactNode[] = [
    <Page>
      <Divider>Channel Selection</Divider>
      <SelectChannelForm
        setChannelStateAction={setChannel}
      />
    </Page>,
    <Page>
      <Divider>Options</Divider>
      <SelectRequestForm
        channel={channel}
        setRequestStateAction={setRequest}
      />
    </Page>,
    <Page>
      <Divider>Execution Progress</Divider>
      <ExecuteProgress
        request={request}
      />
    </Page>,
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
