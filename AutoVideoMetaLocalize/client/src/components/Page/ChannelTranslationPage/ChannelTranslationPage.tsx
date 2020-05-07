import * as React from 'react';
import { Channel } from '../../../../generated-sources/openapi';
import { ChannelSelectForm } from './ChannelSelectForm/ChannelSelectForm';
import { ChannelTranslationConfiguration } from './ChannelTranslationConfiguration';
import { ChannelTranslationConfigurationForm } from './ChannelTranslationConfigurationForm/ChannelTranslationConfigurationForm';
import { ExecuteConfigurationPage } from './ExecuteConfigurationPage/ExecuteConfigurationPage';
import './style.less';

/**
 * The page used to control the flow of the process.
 *
 * @return {JSX.Element}
 */
export function ChannelTranslationPage(): JSX.Element {
  const [current, setCurrent] =
    React.useState<number>(0);

  const [channel, setChannel] =
    React.useState<Channel>(null);

  const [configuration, setConfiguration] =
    React.useState<ChannelTranslationConfiguration>(null);

  /**
   * 
   * @param value
   */
  async function onFinishChannelSelect(value: Channel) {
    setChannel(value);
    setConfiguration({
      ...configuration,
      videos: null,
    });
    setCurrent(current + 1);
  }

  /**
   * 
   * @param value
   */
  async function onFinishConfiguration(value: ChannelTranslationConfiguration) {
    setConfiguration(value);
    setCurrent(current + 1);
  }

  /** Go to the previous page. */
  async function decrementCurrent() {
    setCurrent(current - 1);
  }

  /** Go back to the start of the channel translation process. */
  async function onCompleteExecution() {
    setCurrent(0);
  }

  const content: React.ReactNode[] = [
    <ChannelSelectForm
      onFinish={onFinishChannelSelect}
    />,
    <ChannelTranslationConfigurationForm
      channel={channel}
      onFinish={onFinishConfiguration}
      onBack={decrementCurrent}
    />,
    <ExecuteConfigurationPage
      configuration={configuration}
      onComplete={onCompleteExecution}
    />,
  ];

  return (
    <div className="steps-content">{content[current]}</div>
  );
}

