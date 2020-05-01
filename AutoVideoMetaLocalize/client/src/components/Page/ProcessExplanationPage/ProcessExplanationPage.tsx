import * as React from 'react';
import './style.less';
import { Page } from '../Page';
import { Divider, Row, Col, Card } from 'antd';

const { Meta } = Card;

/**
 * This page outlines how the application in beneficial for the user.
 *
 * @return {JSX.Element}
 */
export function ProcessExplanationPage(): JSX.Element {
  return (
    <Page id="process-explanation-page">
      <Divider>How it Works</Divider>
      <Row align="top" justify="center" gutter={8}>
        <Col span={8}>
          <Card cover={
            <img alt="example" src="https://www.authorsguilds.com/wp-content/uploads/2017/02/youtube.png" />
          }>
            <Meta description="The YouTube algorithm likes content which is local relative to the viewer." />
          </Card>
        </Col>
        <Col span={8}>
          <Card cover={
            <img alt="example" src="https://www.authorsguilds.com/wp-content/uploads/2017/02/youtube.png" />
          }>
            <Meta description="Using Google Translate, AVML can automatically localize the titles and descriptions of your YouTube content." />
          </Card>
        </Col>
        <Col span={8}>
          <Card cover={
            <img alt="example" src="https://www.authorsguilds.com/wp-content/uploads/2017/02/youtube.png" />
          }>
            <Meta description="AVML localized videos report a 40% increase in viewers." />
          </Card>
        </Col>
      </Row>
    </Page>
  );
}
