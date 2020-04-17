import * as React from 'react';
import './style.less';
import {Row, Col} from 'antd';

export const PortfolioPage: React.FunctionComponent<{
  id: string,
}> = (props) => {
  return (
    <Row id={props.id} className="portfolio-page" align="top" justify="center">
      <Col className="fullwidth-lg">
        {props.children}
      </Col>
    </Row>
  );
};
