import {Avatar, Card, Typography, Row, Col} from 'antd';
import * as React from 'react';
import './style.less';
import {Channel} from '../../../generated-sources/openapi';

const {Paragraph} = Typography;

/**
 * A card for displaying the basic information about a YouTube channel, e.g. the channel's title.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function ChannelCard(props: {
  channel?: Channel,
}): JSX.Element {
  const channel: Channel = props.channel;

  if (!channel || !channel.snippet) {
    return null;
  }

  return (
    <Card className="channel-card">
      <Row align="middle" justify="start">
        <Col span={3}>
          <Row align="middle" justify="center">
            <Avatar src={channel.snippet.thumbnails._default.url} size="large" />
          </Row>
        </Col>

        <Col span={14} offset={2}>
          <Paragraph strong>
            {channel.snippet.title}
          </Paragraph>
          <Paragraph>
            {channel.id}
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
}
