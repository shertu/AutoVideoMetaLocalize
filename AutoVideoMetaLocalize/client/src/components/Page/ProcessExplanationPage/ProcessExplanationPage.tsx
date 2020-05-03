import * as React from 'react';
import './style.less';
import { Page } from '../Page';
import { Divider, Row, Col, Card, Statistic } from 'antd';
import { ColProps } from 'antd/lib/col';
import { chance } from 'chance';
import { ArrowUpOutlined } from '@ant-design/icons';

const { Meta } = Card;

const COL_LAYOUT: ColProps = {
  xs: 24,
  md: 12,
  xl: 8,
}

const CARD_SECTION_STYLE: React.CSSProperties = {
  height: '300px',
}

/**
 * This page outlines how the application in beneficial for the user.
 *
 * @return {JSX.Element}
 */
export function ProcessExplanationPage(): JSX.Element {
  const [viewCount, setViewCount] =
    React.useState<number>(927787);

  //let timeout: NodeJS.Timeout = null;
  //React.useEffect(() => {
  //  timeout = setInterval(incrementViewCount, 1000);
  //  return (clearInterval(timeout));
  //}, []);

  //async function incrementViewCount() {
  //  setViewCount(viewCount + chance.integer({ min: 10, max: 100 }))
  //}

  return (
    <Page id="ProcessExplanationPage">
      <Divider>How does it work?</Divider>
      <Row align="top" justify="center" gutter={8}>
        <Col {...COL_LAYOUT} >
          <Card bodyStyle={CARD_SECTION_STYLE} cover={
            <Row align="middle" justify="center" style={CARD_SECTION_STYLE}>
              <img alt="example" src="https://www.authorsguilds.com/wp-content/uploads/2017/02/youtube.png"
                style={{ height: '100%', objectFit: 'cover' }} />
            </Row>
          }>
            <Meta description="The YouTube algorithm tends to recommend content which is local in relation to the viewer." />
          </Card>
        </Col>
        <Col {...COL_LAYOUT} >
          <Card bodyStyle={CARD_SECTION_STYLE} cover={
            <Row align="middle" justify="center" style={CARD_SECTION_STYLE}>
              <img alt="example" src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Cloud-Translation-Logo.svg"
                style={{ width: 200 }} />
            </Row>
          }>
            <Meta description="This service can automatically localize content on YouTube by translating it into several languages." />
          </Card>
        </Col>
        <Col {...COL_LAYOUT} >
          <Card bodyStyle={CARD_SECTION_STYLE} cover={
            <Row align="middle" justify="center" style={CARD_SECTION_STYLE}>
              <Statistic
                title="View Count"
                value={viewCount}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
                suffix="views"
                style={{ textAlign: 'center' }}
              />
            </Row>
          }>
            <Meta description="The content affected by this service tends to be viewed more frequently." />
          </Card>
        </Col>
      </Row>
    </Page>
  );
}
