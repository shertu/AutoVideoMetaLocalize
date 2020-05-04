import { Row, Typography } from 'antd';
import * as React from 'react';
import { Page } from '../Page';
import './style.less';
import UserContext from '../../UserContext/UserContext';
import { SelectChannelStepContent } from './SelectChannelStepContent/SelectChannelStepContent';
import { Channel } from '../../../../generated-sources/openapi';

const { Paragraph } = Typography;

/**
 * The page used to sign-in to google and select a YouTube channel.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ProcessPage(): JSX.Element {
  // user
  const user = React.useContext(UserContext);

  if (user == null) {
    return (
      <Row align="middle" justify="center">
        <Paragraph className="max-cell-xs">
          To use this service please sign-in to YouTube.
        </Paragraph>
      </Row>
    )
  }

  // step
  const [current, setCurrent] =
    React.useState<number>(0);

  async function incrementCurrent() {
    setCurrent(current + 1);
  }

  async function decrementCurrent() {
    setCurrent(current - 1);
  }

  // channel
  const [channel, setChannel] =
    React.useState<Channel>(null);

  async function onContinue(channel: Channel) {
    setChannel(channel);
    incrementCurrent();
  }

  let currentContent: React.ReactNode;
  switch (current) {
    case 0:
      currentContent = <SelectChannelStepContent onContinue={onContinue} />
      break;
    default:
      currentContent = null;
  }

  // render
  return (
    <Page id="process-page">
      <div className="steps-content">{currentContent}</div>
      <div className="steps-action"></div>
    </Page>
  );
}

//<Steps current={current}>
//  {steps.map(item => (
//    <Step key={item.title} title={item.title} />
//  ))}
//</Steps>
