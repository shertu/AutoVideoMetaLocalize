import {Avatar, Card, Typography, Row, Col} from 'antd';
import * as React from 'react';
import './style.less';
import {Channel, Thumbnail} from '../../../generated-sources/openapi';

const {Paragraph} = Typography;

/**
 * A view card for a YouTube channel.
 *
 * @param {object} props
 * @param {Channel} props.channel The YouTube channel information.
 * @return {JSX.Element}
 */
export function ChannelCard(props: {
  channel?: Channel,
}): JSX.Element {
  const thumbnail: Thumbnail = props.channel?.snippet?.thumbnails._default;
  const name: string = props.channel?.snippet?.title;
  const id: string = props.channel?.id;

  return (
    <Card className="channel-card">
      <Row align="middle" justify="start">
        <Col span={3}>
          <Row align="middle" justify="center">
            {thumbnail && (
              <Avatar src={thumbnail.url} style={{width: thumbnail.width, height: thumbnail.height}} />
            )}
          </Row>
        </Col>

        <Col span={14} offset={2}>
          <Paragraph strong>{name}</Paragraph>
          <Paragraph>{id}</Paragraph>
        </Col>
      </Row>
    </Card>
  );
}
