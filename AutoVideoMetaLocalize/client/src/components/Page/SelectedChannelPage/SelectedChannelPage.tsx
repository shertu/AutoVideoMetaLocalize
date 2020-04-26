import * as React from 'react';
import { Channel } from '../../../../generated-sources/openapi';
import { Page } from '../Page';
import './style.less';
import { TranslateChannelPage } from '../TranslateChannelPage/TranslateChannelPage';
import { ChannelSelectionPage } from '../ChannelSelectionPage/ChannelSelectionPage';
import { Typography, Row } from 'antd';

const { Title, Paragraph, Text } = Typography;

/**
 * The main content of this web application.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function SelectedChannelPage(): JSX.Element {
  const [selectedChannel, setSelectedChannel] =
    React.useState<Channel>(null);

  return (
    <Page id="selected-channel">
      {!selectedChannel && (
        <Typography>
          <Title className="site-title">Auto Video Meta Localize</Title >

          <Row align="middle" justify="center">
            <Paragraph className="max-cell-xs">
              Welcome to <Text strong>Auto Video Meta Localize</Text> - The service which can translate or localize the titles
              and descriptions of your YouTube videos to make them accessible to a larger audience.
            </Paragraph>
          </Row>
        </Typography>
      )}

      {selectedChannel ? (
        <TranslateChannelPage
          channel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />
      ) : (
          <ChannelSelectionPage setSelectedChannel={setSelectedChannel} />
        )}
    </Page>
  );
}
