import * as React from 'react';
import { Channel } from '../../../../generated-sources/openapi';
import { Page } from '../Page';
import './style.less';
import { TranslateChannelPage } from '../TranslateChannelPage/TranslateChannelPage';
import { SelectChannelPage } from '../SelectChannelPage/SelectChannelPage';
import { Typography, Row } from 'antd';
import { ProcessExplanationPage } from '../ProcessExplanationPage/ProcessExplanationPage';

const { Title, Paragraph, Text } = Typography;

/**
 * The main page of this web application.
 *
 * @return {JSX.Element}
 */
export function MainChannelPage(): JSX.Element {
  const [selectedChannel, setSelectedChannel] =
    React.useState<Channel>(null);

  return (
    <Page id="MainChannelPage">
      <Typography>
        <Title className="site-title">Auto Video Meta Localize</Title >

        <Row align="middle" justify="center">
          <Paragraph className="max-cell-xs">
            Welcome to <Text strong>Auto Video Meta Localize.</Text>&nbsp;The
              service which can translate or localize the titles and descriptions
              of your YouTube videos to make them accessible to a larger audience.
            </Paragraph>
        </Row>
      </Typography>

      {selectedChannel ? (
        <TranslateChannelPage
          channel={selectedChannel}
          onBack={() => setSelectedChannel(null)}
        />
      ) : (
          <SelectChannelPage setSelectedChannel={setSelectedChannel} />
        )}

      {!selectedChannel && (
        <ProcessExplanationPage />
      )}
    </Page>
  );
}
