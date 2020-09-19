import {Avatar, Col, Row, Typography} from 'antd';
import * as React from 'react';
import {Thumbnail} from '../../../generated-sources/openapi';

const {Paragraph} = Typography;

/**
 * A simple information view component with an image, title and subtitle.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function BasicComboView(props: {
  thumbnail?: Thumbnail;
  title?: string;
  subtitle?: string;
  avatarShape?: 'circle' | 'square';
}): JSX.Element {
  const {thumbnail, title, subtitle, avatarShape} = props;

  return (
    <Row className="max-cell-xs" align="middle" justify="start" style={{minHeight: 120, wordBreak: 'break-word'}}>
      <Col span={8}>
        <Row align="middle" justify="center">
          {thumbnail && (
            <Avatar
              src={thumbnail.url}
              style={{width: thumbnail.width, height: thumbnail.height}}
              shape={avatarShape}
            />
          )}
        </Row>
      </Col>

      <Col span={14} offset={2}>
        <Row align="middle" justify="start">
          <Typography>
            <Paragraph strong>{title}</Paragraph>
            <Paragraph>{subtitle}</Paragraph>
          </Typography>
        </Row>
      </Col>
    </Row>
  );
}
