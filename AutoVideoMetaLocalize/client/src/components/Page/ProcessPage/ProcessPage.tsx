import * as React from 'react';
import { Page } from '../Page';
import './style.less';
import { Channel, ApiYouTubeVideoTranslatePostRequest } from '../../../../generated-sources/openapi';
import { SetChannelStep } from './SetChannelStep/SetChannelStep';
import { SetRequestStep } from './SetRequestStep/SetRequestStep';
import { ExecuteRequestStep } from './ExecuteRequestStep/ExecuteRequestStep';

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ProcessPage(): JSX.Element {
  const [currentStep, setCurrentStep] =
    React.useState<number>(0);

  const [channel, setChannel] =
    React.useState<Channel>(null);

  const [request, setRequest] =
    React.useState<ApiYouTubeVideoTranslatePostRequest>(null);

  /**
   * Go to the next page.
   */
  async function incrementCurrentStep(): Promise<void> {
    setCurrentStep(currentStep + 1);
  }

  /**
   * Go to the previous page.
   */
  async function decrementCurrentStep(): Promise<void> {
    setCurrentStep(currentStep - 1);
  }

  const content: React.ReactNode[] = [
    (<SetChannelStep
      setChannel={setChannel}
      onNext={incrementCurrentStep}
    />),
    (<SetRequestStep
      channel={channel}
      setRequest={setRequest}
      onNext={incrementCurrentStep}
      onPrev={decrementCurrentStep}
    />),
    (<ExecuteRequestStep
      request={request}
    />),
  ];

  return (
    <Page>
      <div className="steps-content">{content[currentStep]}</div>
      <div className="steps-action"></div>
    </Page>
  );
}

// <Steps current={current}>
//  {steps.map(item => (
//    <Step key={item.title} title={item.title} />
//  ))}
// </Steps>
