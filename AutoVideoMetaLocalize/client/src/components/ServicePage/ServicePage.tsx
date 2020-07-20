import { Result, Button } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Channel } from '../../../generated-sources/openapi';
import UserContext from '../UserContext/UserContext';
import { ServiceExecutionPage } from './ServiceExecutionPage/ServiceExecutionPage';
import { ServiceFormContainer } from './ServiceFormContainer/ServiceFormContainer';
import { ServiceFormInput } from './ServiceFormInput';
import { YouTubeChannelSelectFormContainer } from './YouTubeChannelSelectFormContainer/YouTubeChannelSelectFormContainer';
import routes from '../../routes';

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ServicePage(): JSX.Element {
  const user = React.useContext(UserContext);

  const [currentStep, setCurrentStep] =
    React.useState<number>(0);

  const [serviceFormInputs, setServiceFormInputs] =
    React.useState<ServiceFormInput>(null);

  const [selectedChannel, setSelectedChannel] =
    React.useState<Channel>(null);

  // cached information

  /**
   * Called when the channel selection form is successfully filled out and submitted.
   *
   * @param {Channel} value
   */
  function onFinishChannelSelect(value: Channel) {
    setSelectedChannel(value);
    setServiceFormInputs({
      ...serviceFormInputs,
      videos: null,
    });
    setCurrentStep(currentStep + 1);
  }

  /**
   * Called when the options form is successfully filled out and submitted.
   *
   * @param {ServiceFormInput} value
   */
  function onFinishInputForm(value: ServiceFormInput) {
    setServiceFormInputs(value);
    setCurrentStep(currentStep + 1);
  }

  /** Go to the previous page. */
  function decrementCurrent() {
    setCurrentStep(currentStep - 1);
  }

  /** Go back to the start of the channel translation process. */
  function onServiceCompletion() {
    setCurrentStep(1);
  }

  const content: React.ReactNode[] = [
    <YouTubeChannelSelectFormContainer
      key={0}
      onFinishSelection={onFinishChannelSelect}
    />,
    <ServiceFormContainer
      key={1}
      channel={selectedChannel}
      onFinishForm={onFinishInputForm}
      onBack={decrementCurrent}
    />,
    <ServiceExecutionPage
      key={2}
      configuration={serviceFormInputs}
      onComplete={onServiceCompletion}
    />,
  ];

  if (!user) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this part of the website."
        extra={
          <Link to={routes.ROUTE_HOME}>
            <Button type="primary">Go Home</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="steps-content">{content[currentStep]}</div>
  );
}

