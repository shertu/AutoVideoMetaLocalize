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
          <Card cover={
            <img className="cover-item" alt="example" src="https://www.authorsguilds.com/wp-content/uploads/2017/02/youtube.png" />
          }>
            <Meta description="The YouTube algorithm tends to recommend content which is local in relation the viewer." />
          </Card>
        </Col>
        <Col {...COL_LAYOUT} >
          <Card cover={
            <img className="cover-item" alt="example" src="https://www.authorsguilds.com/wp-content/uploads/2017/02/youtube.png" />
          }>
            <Meta description="This service can add localizations to content on YouTube in wide range of languages." />
          </Card>
        </Col>
        <Col {...COL_LAYOUT} >
          <Card cover={
            <Row className="cover-item" align="middle" justify="center">
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
            <Meta description="Content localized using AVML tends to double in views." />
          </Card>
        </Col>
      </Row>
    </Page>
  );
}
