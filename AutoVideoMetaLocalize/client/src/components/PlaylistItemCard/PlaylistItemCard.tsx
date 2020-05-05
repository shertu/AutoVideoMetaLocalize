import { Avatar, Card, Typography, Row, Col } from 'antd';
import * as React from 'react';
import './style.less';
import { Thumbnail, PlaylistItem } from '../../../generated-sources/openapi';

const { Paragraph } = Typography;

/**
 * A view card for a YouTube channel.
 *
 * @param {object} props
 * @param {Channel} props.channel The YouTube channel information.
 * @return {JSX.Element}
 */
export function PlaylistItemCard(props: {
  playlistItem?: PlaylistItem,
}): JSX.Element {
  const thumbnail: Thumbnail = props.playlistItem?.snippet?.thumbnails._default;
  const name: string = props.playlistItem?.snippet?.title;
  const publishedAt: Date = props.playlistItem?.snippet?.publishedAt;

  return (
    <Card className="channel-card">
      <Row align="middle" justify="start">
        <Col span={8}>
          <Row align="middle" justify="center">
            {thumbnail && (
              <Avatar shape="square" src={thumbnail.url} style={{ width: thumbnail.width, height: thumbnail.height }} />
            )}
          </Row>
        </Col>

        <Col span={14} offset={2}>
          <Typography>
            <Paragraph strong>{name}</Paragraph>
            <Paragraph>{publishedAt.toLocaleDateString()}</Paragraph>
          </Typography>
        </Col>
      </Row>
    </Card>
  );
}
