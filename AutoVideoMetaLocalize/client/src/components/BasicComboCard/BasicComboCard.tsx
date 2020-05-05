import {Avatar, Card, Typography, Row, Col} from 'antd';
import * as React from 'react';
import './style.less';
import {Thumbnail} from '../../../generated-sources/openapi';

const {Paragraph} = Typography;

/**
 * A basic information card with an image, title and subtitle.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
export function BasicComboCard(props: {
  thumbnail?: Thumbnail,
  title?: string,
  subtitle?: string,
  avatarShape?: 'circle' | 'square',
}): JSX.Element {
  return (
    <Card className="basic-combo-card">
      <Row align="middle" justify="start">
        <Col span={8}>
          <Row align="middle" justify="center">
            {props.thumbnail && (
              <Avatar
                src={props.thumbnail.url}
                style={{width: props.thumbnail.width, height: props.thumbnail.height}}
                shape={props.avatarShape}
              />
            )}
          </Row>
        </Col>

        <Col span={14} offset={2}>
          <Typography>
            <Paragraph strong>{props.title}</Paragraph>
            <Paragraph>{props.subtitle}</Paragraph>
          </Typography>
        </Col>
      </Row>
    </Card>
  );
}
